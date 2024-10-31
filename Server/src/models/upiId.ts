import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    upiId: {
      type: String,
      required: [true, "Please enter Upi ID"],
    },
  },
  {
    timestamps: true,
  }
);

export const UpiId = mongoose.model("UpiId", schema);
