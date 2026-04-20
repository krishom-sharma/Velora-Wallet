import { body, param } from "express-validator";

export const addCardValidator = [
  body("cardHolderName").trim().isLength({ min: 2 }).withMessage("Card holder name is required"),
  body("cardNumber")
    .trim()
    .matches(/^\d{15,16}$/)
    .withMessage("Enter a valid card number"),
  body("expiry")
    .trim()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
    .withMessage("Expiry must be in MM/YY format")
];

export const cardIdValidator = [param("id").isMongoId().withMessage("Invalid card id")];
