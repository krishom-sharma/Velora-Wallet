import crypto from "crypto";
import { env } from "../config/env.js";

const algorithm = "aes-256-gcm";
const key = Buffer.from(env.cardEncryptionKey, "hex");

if (key.length !== 32) {
  throw new Error("CARD_ENCRYPTION_KEY must be a 64-character hex string");
}

export const encryptText = (value) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
};

export const decryptText = (value) => {
  const [ivHex, authTagHex, contentHex] = value.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivHex, "hex")
  );
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(contentHex, "hex")),
    decipher.final()
  ]);
  return decrypted.toString("utf8");
};
