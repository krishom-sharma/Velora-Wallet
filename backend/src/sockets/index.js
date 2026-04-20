import { Server } from "socket.io";
import { env } from "../config/env.js";
import { userRoom } from "../services/socketService.js";
import { verifyToken } from "../utils/token.js";

const parseCookie = (cookieHeader = "") =>
  cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const [key, ...value] = part.split("=");
      acc[key] = decodeURIComponent(value.join("="));
      return acc;
    }, {});

export const createSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true
    }
  });

  io.use((socket, next) => {
    try {
      const cookies = parseCookie(socket.handshake.headers.cookie);
      if (!cookies.token) {
        return next(new Error("Unauthorized"));
      }

      const decoded = verifyToken(cookies.token);
      socket.userId = decoded.userId;
      return next();
    } catch (_error) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(userRoom(socket.userId));
    socket.emit("socket:ready", { ok: true });
  });

  return io;
};
