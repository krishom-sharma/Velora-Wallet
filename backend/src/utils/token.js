import jwt from "jsonwebtoken";
import { env, isProduction } from "../config/env.js";

export const signToken = (userId) =>
  jwt.sign({ userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);

export const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: isProduction,
  maxAge: 1000 * 60 * 60 * 24 * 7
};

export const setAuthCookie = (res, token) => {
  res.cookie("token", token, authCookieOptions);
};

export const clearAuthCookie = (res) => {
  res.clearCookie("token", authCookieOptions);
};
