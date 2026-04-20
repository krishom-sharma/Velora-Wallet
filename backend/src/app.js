import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import csrf from "csurf";
import path from "path";
import { env, isProduction } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.cookieSecret));
app.use(mongoSanitize());
app.use(hpp());
app.use(morgan("dev"));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false
});

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction
  }
});

app.use(globalLimiter);
app.use("/uploads", express.static(path.resolve("src/uploads")));
app.get("/api/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/auth", authLimiter, csrfProtection, authRoutes);
app.use("/api/dashboard", csrfProtection, dashboardRoutes);
app.use("/api/transactions", csrfProtection, transactionRoutes);
app.use("/api/cards", csrfProtection, cardRoutes);
app.use("/api/profile", csrfProtection, profileRoutes);
app.use("/api/settings", csrfProtection, settingsRoutes);
app.use("/api/notifications", csrfProtection, notificationRoutes);
app.use("/api/users", csrfProtection, userRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
