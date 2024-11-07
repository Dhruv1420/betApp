import express from "express";
import {
  changePaymentStatus,
  changeWithdrawStatus,
  createPaymentIntent,
  paymentDetails,
  withdrawRequest,
} from "../controllers/payment.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

app.post("/create", createPaymentIntent);

app.post("/paymentdetails", paymentDetails);

app.post("/statusChange", adminOnly, changePaymentStatus);

app.post("/withdrawstatus", adminOnly, changeWithdrawStatus);

app.post("/withdraw", withdrawRequest);

export default app;
