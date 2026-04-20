import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve("src/uploads"));
  },
  filename: (_req, file, cb) => {
    const suffix = crypto.randomBytes(6).toString("hex");
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${suffix}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  }
});
