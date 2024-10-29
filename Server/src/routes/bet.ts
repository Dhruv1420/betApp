import express from "express";
import { getNumber, stopNumberGeneration } from "../controllers/bet.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

app.post("/new", adminOnly, getNumber);
app.post("/stopbet/:betId", stopNumberGeneration);
export default app;
