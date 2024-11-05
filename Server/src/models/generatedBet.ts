// models/generatedBet.ts
import mongoose from "mongoose";

const generatedBetSchema = new mongoose.Schema({
  betId: { type: mongoose.Schema.Types.ObjectId, ref: "Bet" },
  generatedNumber: { type: Number, required: true },
  updatedAmount: { type: Number, required: true },
  tableData: [
    {
      number: { type: Number, required: true },
      period: { type: Number, required: true },
      empty: { type: Number, required: true },
      amount: { type: Number, required: true },
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

export const GeneratedBet = mongoose.model("GeneratedBet", generatedBetSchema);
