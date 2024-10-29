// models/generatedBet.ts
import mongoose from "mongoose";

const generatedBetSchema = new mongoose.Schema({
  betId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bet' },
  generatedNumber: { type: Number, required: true },
  updatedAmount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const GeneratedBet = mongoose.model("GeneratedBet", generatedBetSchema);
