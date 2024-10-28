import express from "express";
import {
  createPaymentIntent,
  paymentDetails,
  withdrawRequest,
} from "../controllers/payment.js";

const app = express.Router();

app.post("/create", createPaymentIntent);

app.post("/paymentdetails", paymentDetails);

app.post("/withdraw", withdrawRequest);

export default app;
