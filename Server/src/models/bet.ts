import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

export const Bet = mongoose.model("Bet", schema);
