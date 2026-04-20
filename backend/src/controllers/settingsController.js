import { asyncHandler } from "../utils/asyncHandler.js";

export const getSettings = asyncHandler(async (req, res) => {
  return res.status(200).json({
    theme: req.user.theme,
    notificationPreferences: req.user.notificationPreferences,
    security: req.user.security
  });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const { theme, notificationPreferences, security } = req.body;

  if (theme) {
    req.user.theme = theme;
  }
  if (notificationPreferences) {
    req.user.notificationPreferences = {
      ...req.user.notificationPreferences.toObject(),
      ...notificationPreferences
    };
  }
  if (security) {
    req.user.security = {
      ...req.user.security.toObject(),
      ...security
    };
  }

  await req.user.save();

  return res.status(200).json({
    theme: req.user.theme,
    notificationPreferences: req.user.notificationPreferences,
    security: req.user.security
  });
});
