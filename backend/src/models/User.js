import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const notificationPreferencesSchema = new mongoose.Schema(
  {
    push: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false }
  },
  { _id: false }
);

const securitySchema = new mongoose.Schema(
  {
    biometricLock: { type: Boolean, default: true },
    loginAlerts: { type: Boolean, default: true },
    trustedDeviceMode: { type: Boolean, default: false }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      minlength: 3,
      maxlength: 24
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    avatar: {
      type: String,
      default: ""
    },
    balance: {
      type: Number,
      default: 5000,
      min: 0
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system"
    },
    notificationPreferences: {
      type: notificationPreferencesSchema,
      default: () => ({})
    },
    security: {
      type: securitySchema,
      default: () => ({})
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    }
  }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model("User", userSchema);
