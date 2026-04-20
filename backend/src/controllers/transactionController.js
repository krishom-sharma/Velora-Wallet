import { User } from "../models/User.js";
import { Transaction } from "../models/Transaction.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createMoneyRequest,
  fulfillMoneyRequest,
  generateQrPayload,
  parseQrPayload,
  transferMoney
} from "../services/transactionService.js";

export const getTransactions = asyncHandler(async (req, res) => {
  const { search = "", category, status, type, dateFrom, dateTo } = req.query;

  const filter = {
    $or: [{ sender: req.user.id }, { receiver: req.user.id }]
  };

  if (category) filter.category = category;
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo);
  }

  if (search.trim()) {
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    }).select("_id");

    filter.$and = [
      {
        $or: [
          { note: { $regex: search, $options: "i" } },
          { sender: { $in: users.map((item) => item._id) } },
          { receiver: { $in: users.map((item) => item._id) } }
        ]
      }
    ];
  }

  const transactions = await Transaction.find(filter)
    .populate("sender", "name username email avatar")
    .populate("receiver", "name username email avatar")
    .sort({ createdAt: -1 });

  const pendingRequests = await Transaction.find({
    sender: req.user.id,
    status: "requested",
    type: "request"
  })
    .populate("receiver", "name username avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    transactions,
    pendingRequests
  });
});

export const sendMoney = asyncHandler(async (req, res) => {
  const { recipient, amount, category, note } = req.body;
  const result = await transferMoney({
    app: req.app,
    senderId: req.user.id,
    recipientHandle: recipient,
    amount: Number(amount),
    category,
    note,
    type: "transfer",
    channel: "manual"
  });

  return res.status(201).json(result);
});

export const requestMoney = asyncHandler(async (req, res) => {
  const { requestFrom, amount, category, note } = req.body;
  const transaction = await createMoneyRequest({
    app: req.app,
    requesterId: req.user.id,
    requestFrom,
    amount: Number(amount),
    category,
    note
  });

  return res.status(201).json({ transaction });
});

export const payRequest = asyncHandler(async (req, res) => {
  const transaction = await fulfillMoneyRequest({
    app: req.app,
    payerId: req.user.id,
    transactionId: req.params.id
  });

  return res.status(200).json({ transaction });
});

export const generateQr = asyncHandler(async (req, res) => {
  const { amount, note } = req.body;
  const data = await generateQrPayload({
    user: req.user,
    amount: amount ? Number(amount) : null,
    note
  });

  return res.status(200).json(data);
});

export const processQrPayment = asyncHandler(async (req, res) => {
  const parsed = parseQrPayload(req.body.payload);
  const amount = Number(req.body.amount || parsed.amount);
  const result = await transferMoney({
    app: req.app,
    senderId: req.user.id,
    recipientId: parsed.recipientId,
    amount,
    category: req.body.category || "other",
    note: req.body.note || parsed.note || "",
    type: "qr",
    channel: "qr"
  });

  return res.status(201).json(result);
});
