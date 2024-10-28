import express from "express";
import { getNumber } from "../controllers/bet.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

app.post("/new", adminOnly, getNumber);

export default app;
