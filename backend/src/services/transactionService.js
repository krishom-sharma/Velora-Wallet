import QRCode from "qrcode";
import { User } from "../models/User.js";
import { Transaction } from "../models/Transaction.js";
import { AppError } from "../utils/appError.js";
import { createReference } from "../utils/transaction.js";
import { createNotification } from "./notificationService.js";
import { emitToUser } from "./socketService.js";

const userSelect = "name username email avatar balance theme";
const participantSelect = "name username email avatar";

const populateTransaction = (query) =>
  query.populate("sender", participantSelect).populate("receiver", participantSelect);

const findRecipient = async (handle) => {
  const normalized = handle.trim().toLowerCase();
  return User.findOne({
    $or: [{ email: normalized }, { username: normalized.replace(/^@/, "") }]
  });
};

export const transferMoney = async ({
  app,
  senderId,
  recipientHandle,
  recipientId,
  amount,
  category = "other",
  note = "",
  type = "transfer",
  channel = "wallet"
}) => {
  const sender = await User.findById(senderId);
  const receiver = recipientId
    ? await User.findById(recipientId)
    : await findRecipient(recipientHandle);

  if (!sender || !receiver) {
    throw new AppError("Recipient could not be found", 404);
  }

  if (sender.id === receiver.id) {
    throw new AppError("You cannot send money to yourself", 400);
  }

  if (sender.balance < amount) {
    throw new AppError("Insufficient balance", 400);
  }

  sender.balance -= amount;
  receiver.balance += amount;

  await Promise.all([sender.save(), receiver.save()]);

  const transaction = await Transaction.create({
    sender: sender.id,
    receiver: receiver.id,
    amount,
    category,
    note,
    type,
    channel,
    status: "completed",
    reference: createReference(type === "qr" ? "QR" : "PAY")
  });

  const hydrated = await populateTransaction(Transaction.findById(transaction.id));

  await Promise.all([
    createNotification({
      app,
      userId: sender.id,
      title: "Transfer complete",
      body: `You sent ${amount.toFixed(2)} to @${receiver.username}.`,
      meta: { transactionId: transaction.id }
    }),
    createNotification({
      app,
      userId: receiver.id,
      title: "Money received",
      body: `${sender.name} sent you ${amount.toFixed(2)}.`,
      meta: { transactionId: transaction.id }
    })
  ]);

  emitToUser(app, sender.id, "balance:updated", { balance: sender.balance });
  emitToUser(app, receiver.id, "balance:updated", { balance: receiver.balance });
  emitToUser(app, sender.id, "transaction:created", hydrated);
  emitToUser(app, receiver.id, "transaction:created", hydrated);

  return {
    transaction: hydrated,
    sender: sender.toJSON(),
    receiver: receiver.toJSON()
  };
};

export const createMoneyRequest = async ({
  app,
  requesterId,
  requestFrom,
  amount,
  category = "other",
  note = ""
}) => {
  const requester = await User.findById(requesterId);
  const payer = await findRecipient(requestFrom);

  if (!requester || !payer) {
    throw new AppError("User could not be found", 404);
  }

  if (requester.id === payer.id) {
    throw new AppError("You cannot request money from yourself", 400);
  }

  const transaction = await Transaction.create({
    sender: payer.id,
    receiver: requester.id,
    amount,
    category,
    note,
    type: "request",
    channel: "request",
    status: "requested",
    reference: createReference("REQ")
  });

  const hydrated = await populateTransaction(Transaction.findById(transaction.id));

  await createNotification({
    app,
    userId: payer.id,
    title: "Payment request received",
    body: `${requester.name} requested ${amount.toFixed(2)} from you.`,
    type: "request",
    meta: { transactionId: transaction.id }
  });

  emitToUser(app, payer.id, "transaction:request", hydrated);

  return hydrated;
};

export const fulfillMoneyRequest = async ({ app, payerId, transactionId }) => {
  const transaction = await Transaction.findById(transactionId);

  if (!transaction || transaction.status !== "requested") {
    throw new AppError("Payment request not found", 404);
  }

  if (transaction.sender.toString() !== payerId.toString()) {
    throw new AppError("You are not allowed to pay this request", 403);
  }

  const payer = await User.findById(transaction.sender);
  const receiver = await User.findById(transaction.receiver);

  if (!payer || !receiver) {
    throw new AppError("User could not be found", 404);
  }

  if (payer.balance < transaction.amount) {
    throw new AppError("Insufficient balance to complete this request", 400);
  }

  payer.balance -= transaction.amount;
  receiver.balance += transaction.amount;
  transaction.status = "completed";

  await Promise.all([payer.save(), receiver.save(), transaction.save()]);

  const hydrated = await populateTransaction(Transaction.findById(transaction.id));

  await Promise.all([
    createNotification({
      app,
      userId: payer.id,
      title: "Request paid",
      body: `You paid ${transaction.amount.toFixed(2)} to @${receiver.username}.`,
      meta: { transactionId: transaction.id }
    }),
    createNotification({
      app,
      userId: receiver.id,
      title: "Request fulfilled",
      body: `@${payer.username} completed your payment request.`,
      meta: { transactionId: transaction.id }
    })
  ]);

  emitToUser(app, payer.id, "balance:updated", { balance: payer.balance });
  emitToUser(app, receiver.id, "balance:updated", { balance: receiver.balance });
  emitToUser(app, payer.id, "transaction:updated", hydrated);
  emitToUser(app, receiver.id, "transaction:updated", hydrated);

  return hydrated;
};

export const generateQrPayload = async ({ user, amount, note }) => {
  const payload = JSON.stringify({
    recipientId: user.id,
    username: user.username,
    amount: amount || null,
    note: note || "",
    ts: Date.now()
  });
  const qrCode = await QRCode.toDataURL(payload, {
    margin: 1,
    width: 320
  });
  return { payload, qrCode };
};

export const parseQrPayload = (payload) => {
  try {
    const parsed = typeof payload === "string" ? JSON.parse(payload) : payload;
    if (!parsed.recipientId) {
      throw new Error("Missing recipient");
    }
    return parsed;
  } catch (_error) {
    throw new AppError("Invalid QR payload", 400);
  }
};

export const getDashboardAnalytics = async (userId) => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [monthlySpend, categoryBreakdown] = await Promise.all([
    Transaction.aggregate([
      {
        $match: {
          sender: userId,
          status: "completed",
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          spend: { $sum: "$amount" }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]),
    Transaction.aggregate([
      {
        $match: {
          sender: userId,
          status: "completed",
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1)
          }
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ])
  ]);

  return {
    monthlySpend,
    categoryBreakdown
  };
};

export const baseUserSelect = userSelect;
