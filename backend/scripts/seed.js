import mongoose from "mongoose";
import { connectDatabase } from "../src/config/database.js";
import { Card } from "../src/models/Card.js";
import { Notification } from "../src/models/Notification.js";
import { Transaction } from "../src/models/Transaction.js";
import { User } from "../src/models/User.js";
import { cardGradientByBrand, maskCardNumber } from "../src/utils/card.js";
import { encryptText } from "../src/utils/crypto.js";
import { createReference } from "../src/utils/transaction.js";

const users = [
  {
    name: "Avery Quinn",
    username: "avery",
    email: "avery@velora.dev",
    password: "Velora123!",
    balance: 9200,
    theme: "dark"
  },
  {
    name: "Mila Chen",
    username: "milachen",
    email: "mila@velora.dev",
    password: "Velora123!",
    balance: 7400,
    theme: "light"
  },
  {
    name: "Jordan Ellis",
    username: "jordane",
    email: "jordan@velora.dev",
    password: "Velora123!",
    balance: 6100,
    theme: "system"
  }
];

const createCard = (userId, number, expiry, brand, name, isPrimary = false) => {
  const [expiryMonth, expiryYear] = expiry.split("/");
  return {
    userId,
    cardHolderName: name,
    maskedCardNumber: maskCardNumber(number),
    encryptedCardNumber: encryptText(number),
    expiryMonth,
    expiryYear,
    brand,
    gradient: cardGradientByBrand(brand),
    isPrimary
  };
};

const createTransaction = ({ sender, receiver, amount, category, type, channel, note, status }) => ({
  sender,
  receiver,
  amount,
  category,
  type,
  channel,
  note,
  status,
  reference: createReference(type === "qr" ? "QR" : status === "requested" ? "REQ" : "PAY")
});

const seed = async () => {
  await connectDatabase();
  await Promise.all([
    User.deleteMany({}),
    Card.deleteMany({}),
    Transaction.deleteMany({}),
    Notification.deleteMany({})
  ]);

  const createdUsers = await User.create(users);
  const [avery, mila, jordan] = createdUsers;

  await Card.insertMany([
    createCard(avery.id, "4242424242424242", "09/28", "Visa", avery.name, true),
    createCard(avery.id, "5555555555554444", "11/27", "Mastercard", avery.name),
    createCard(mila.id, "378282246310005", "07/29", "Amex", mila.name, true)
  ]);

  await Transaction.insertMany([
    createTransaction({
      sender: avery.id,
      receiver: mila.id,
      amount: 84,
      category: "food",
      type: "transfer",
      channel: "manual",
      note: "Dinner split",
      status: "completed"
    }),
    createTransaction({
      sender: mila.id,
      receiver: avery.id,
      amount: 240,
      category: "travel",
      type: "qr",
      channel: "qr",
      note: "Cab refund",
      status: "completed"
    }),
    createTransaction({
      sender: jordan.id,
      receiver: avery.id,
      amount: 680,
      category: "housing",
      type: "request",
      channel: "request",
      note: "Studio share",
      status: "requested"
    })
  ]);

  await Notification.insertMany([
    {
      userId: avery.id,
      title: "Seed ready",
      body: "Demo wallet data has been loaded successfully.",
      type: "system"
    },
    {
      userId: mila.id,
      title: "Money received",
      body: "Avery sent you 84.00.",
      type: "transaction"
    }
  ]);

  console.log("Seeded users:");
  createdUsers.forEach((user) => {
    console.log(`- ${user.email} / Velora123!`);
  });

  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error("Seeding failed", error);
  await mongoose.disconnect();
  process.exit(1);
});
