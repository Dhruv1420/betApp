import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import Stripe from "stripe";
import { errorMiddleware } from "./middlewares/error.js";
import { connectDB } from "./utils/features.js";
import { corsOption } from "./constants/config.js";

import betRoute from "./routes/bet.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";
import userRoute from "./routes/user.js";
import { stopNumberGeneration } from "./controllers/bet.js";

config({
  path: "./.env",
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";
const STRIPE_KEY = process.env.STRIPE_KEY || "";

connectDB(MONGO_URI);

export const stripe = new Stripe(STRIPE_KEY);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/bet", betRoute);
// app.post("/api/v1/bet/stop/:betId", stopNumberGeneration);
app.use("/api/v1/dashboard", dashboardRoute);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is wroking on port ${PORT}`);
});
