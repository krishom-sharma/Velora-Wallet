import { body, param, query } from "express-validator";

const categories = [
  "food",
  "travel",
  "shopping",
  "housing",
  "salary",
  "health",
  "gifts",
  "utilities",
  "other"
];

export const sendMoneyValidator = [
  body("recipient")
    .trim()
    .notEmpty()
    .withMessage("Recipient email or username is required"),
  body("amount").isFloat({ min: 1 }).withMessage("Amount must be at least 1"),
  body("note").optional().trim().isLength({ max: 120 }),
  body("category").optional().isIn(categories)
];

export const requestMoneyValidator = [
  body("requestFrom")
    .trim()
    .notEmpty()
    .withMessage("Recipient email or username is required"),
  body("amount").isFloat({ min: 1 }).withMessage("Amount must be at least 1"),
  body("note").optional().trim().isLength({ max: 120 }),
  body("category").optional().isIn(categories)
];

export const payRequestValidator = [
  param("id").isMongoId().withMessage("Invalid request id")
];

export const qrPaymentValidator = [
  body("payload").notEmpty().withMessage("QR payload is required"),
  body("amount").optional().isFloat({ min: 1 }),
  body("category").optional().isIn(categories),
  body("note").optional().trim().isLength({ max: 120 })
];

export const transactionListValidator = [
  query("status").optional().isIn(["requested", "completed", "failed"]),
  query("type").optional().isIn(["transfer", "qr", "request"]),
  query("category").optional().isIn(categories)
];
