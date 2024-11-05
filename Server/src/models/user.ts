import mongoose from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter name"],
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
      unique: [true, "Email already exists"],
      validate: validator.default.isEmail,
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      select: false,
    },
    phone: {
      type: Number,
      required: [true, "Please enter phone number"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Please enter gender"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    referalCode: {
      type: String,
      default: null,
    },
    coins: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "inactive",
    },
    withdrawHistory: [
      {
        coins: {
          type: Number,
          default: null,
        },
        status: {
          type: String,
          enum: ["approved", "not approved", "pending"],
          default: "not approved",
        },
      },
    ],
    paymentHistory: [
      {
        amount: {
          type: Number,
          default: null,
        },
        referenceNumber: {
          type: String,
          default: null,
        },
        status: {
          type: String,
          enum: ["completed", "pending"],
          default: "pending",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", schema);
