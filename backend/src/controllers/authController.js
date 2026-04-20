import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import { clearAuthCookie, setAuthCookie, signToken } from "../utils/token.js";

const authResponse = (res, user, statusCode = 200) => {
  const token = signToken(user.id);
  setAuthCookie(res, token);
  return res.status(statusCode).json({
    user
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw new AppError("Email or username already exists", 409);
  }

  const user = await User.create({
    name,
    username,
    email,
    password
  });

  return authResponse(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  return authResponse(res, user);
});

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  return res.status(200).json({ message: "Logged out successfully" });
});

export const me = asyncHandler(async (req, res) => {
  return res.status(200).json({ user: req.user });
});

export const csrfToken = asyncHandler(async (req, res) => {
  return res.status(200).json({ csrfToken: req.csrfToken() });
});
