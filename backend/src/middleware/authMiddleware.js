import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import { verifyToken } from "../utils/token.js";

export const protect = async (req, _res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError("User not found", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError("Invalid or expired session", 401));
  }
};
