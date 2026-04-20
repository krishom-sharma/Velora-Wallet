import { body } from "express-validator";

export const profileValidator = [
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Name is too short"),
  body("username")
    .optional()
    .trim()
    .toLowerCase()
    .matches(/^[a-z0-9_]{3,24}$/)
    .withMessage("Username must be 3-24 characters and use letters, numbers, or underscores"),
  body("email").optional().trim().isEmail().withMessage("Enter a valid email").normalizeEmail()
];
