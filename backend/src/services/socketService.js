export const userRoom = (userId) => `user:${userId}`;

export const emitToUser = (app, userId, event, payload) => {
  const io = app.get("io");
  if (!io) {
    return;
  }
  io.to(userRoom(userId.toString())).emit(event, payload);
};
