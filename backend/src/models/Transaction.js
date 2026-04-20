import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    category: {
      type: String,
      enum: [
        "food",
        "travel",
        "shopping",
        "housing",
        "salary",
        "health",
        "gifts",
        "utilities",
        "other"
      ],
      default: "other"
    },
    type: {
      type: String,
      enum: ["transfer", "qr", "request"],
      default: "transfer"
    },
    channel: {
      type: String,
      enum: ["manual", "wallet", "qr", "request"],
      default: "wallet"
    },
    status: {
      type: String,
      enum: ["requested", "completed", "failed"],
      default: "completed"
    },
    note: {
      type: String,
      trim: true,
      maxlength: 120,
      default: ""
    },
    reference: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
