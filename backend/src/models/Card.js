import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    cardHolderName: {
      type: String,
      required: true,
      trim: true
    },
    maskedCardNumber: {
      type: String,
      required: true
    },
    encryptedCardNumber: {
      type: String,
      required: true
    },
    expiryMonth: {
      type: String,
      required: true
    },
    expiryYear: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
    },
    gradient: {
      type: String,
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.encryptedCardNumber;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const Card = mongoose.model("Card", cardSchema);
