import fs from "fs/promises";
import path from "path";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";

const normalizeAvatar = (req) =>
  req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;

export const getProfile = asyncHandler(async (req, res) => {
  return res.status(200).json({ profile: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, username, email } = req.body;

  if (username || email) {
    const conflict = await User.findOne({
      _id: { $ne: req.user.id },
      $or: [
        username ? { username } : null,
        email ? { email } : null
      ].filter(Boolean)
    });

    if (conflict) {
      throw new AppError("Email or username is already in use", 409);
    }
  }

  if (name) req.user.name = name;
  if (username) req.user.username = username;
  if (email) req.user.email = email;

  const avatarUrl = normalizeAvatar(req);
  if (avatarUrl) {
    if (req.user.avatar?.includes("/uploads/")) {
      const existing = req.user.avatar.split("/uploads/").pop();
      await fs
        .unlink(path.resolve("src/uploads", existing))
        .catch(() => undefined);
    }
    req.user.avatar = avatarUrl;
  }

  await req.user.save();

  return res.status(200).json({ profile: req.user });
});
