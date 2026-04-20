import { Card } from "../models/Card.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import { cardGradientByBrand, getCardBrand, maskCardNumber } from "../utils/card.js";
import { encryptText } from "../utils/crypto.js";

export const getCards = asyncHandler(async (req, res) => {
  const cards = await Card.find({ userId: req.user.id }).sort({
    isPrimary: -1,
    createdAt: -1
  });
  return res.status(200).json({ cards });
});

export const addCard = asyncHandler(async (req, res) => {
  const { cardHolderName, cardNumber, expiry } = req.body;
  const [expiryMonth, expiryYear] = expiry.split("/");
  const brand = getCardBrand(cardNumber);

  const existingCards = await Card.countDocuments({ userId: req.user.id });

  const card = await Card.create({
    userId: req.user.id,
    cardHolderName,
    maskedCardNumber: maskCardNumber(cardNumber),
    encryptedCardNumber: encryptText(cardNumber),
    expiryMonth,
    expiryYear,
    brand,
    gradient: cardGradientByBrand(brand),
    isPrimary: existingCards === 0
  });

  return res.status(201).json({ card });
});

export const deleteCard = asyncHandler(async (req, res) => {
  const card = await Card.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!card) {
    throw new AppError("Card not found", 404);
  }

  await card.deleteOne();

  const remaining = await Card.findOne({ userId: req.user.id }).sort({ createdAt: 1 });
  if (remaining && !(await Card.exists({ userId: req.user.id, isPrimary: true }))) {
    remaining.isPrimary = true;
    await remaining.save();
  }

  return res.status(200).json({ message: "Card removed successfully" });
});
