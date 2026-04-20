import dotenv from "dotenv";

dotenv.config();

const required = ["MONGO_URI", "JWT_SECRET", "CLIENT_URL", "CARD_ENCRYPTION_KEY"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL,
  cookieSecret: process.env.COOKIE_SECRET || process.env.JWT_SECRET,
  cardEncryptionKey: process.env.CARD_ENCRYPTION_KEY
};

export const isProduction = env.nodeEnv === "production";
