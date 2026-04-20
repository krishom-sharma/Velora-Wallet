import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id }).sort({
    createdAt: -1
  });

  return res.status(200).json({ notifications });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { isRead: true },
    { new: true }
  );

  return res.status(200).json({ notification });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true });
  return res.status(200).json({ message: "Notifications marked as read" });
});
