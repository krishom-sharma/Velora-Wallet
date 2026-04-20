import { Notification } from "../models/Notification.js";
import { emitToUser } from "./socketService.js";

export const createNotification = async ({
  app,
  userId,
  title,
  body,
  type = "transaction",
  meta = {}
}) => {
  const notification = await Notification.create({
    userId,
    title,
    body,
    type,
    meta
  });

  emitToUser(app, userId, "notification:new", notification);
  return notification;
};
