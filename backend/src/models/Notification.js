import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["transaction", "request", "security", "system"],
      default: "transaction"
    },
    isRead: {
      type: Boolean,
      default: false
    },
    meta: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
