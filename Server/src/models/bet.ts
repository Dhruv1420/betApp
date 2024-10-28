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
  },
  {
    timestamps: true,
  }
);

export const Bet = mongoose.model("Bet", schema);
