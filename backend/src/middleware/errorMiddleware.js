import { AppError } from "../utils/appError.js";

export const notFound = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler = (error, _req, res, _next) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "field";
    return res.status(409).json({
      message: `${field} already exists`
    });
  }

  if (error.code === "EBADCSRFTOKEN") {
    return res.status(403).json({
      message: "Session security token is invalid. Refresh and try again."
    });
  }

  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    message: error.message || "Something went wrong",
    details: error.details || null
  });
};
