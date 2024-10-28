import express from "express";
import { addCoins } from "../controllers/stats.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

app.put("/addcoins/:id", adminOnly, addCoins);

export default app;
