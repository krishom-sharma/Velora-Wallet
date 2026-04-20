import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required"),
  body("username")
    .trim()
    .toLowerCase()
    .matches(/^[a-z0-9_]{3,24}$/)
    .withMessage("Username must be 3-24 characters and use letters, numbers, or underscores"),
  body("email").trim().isEmail().withMessage("Enter a valid email").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Enter a valid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required")
];
