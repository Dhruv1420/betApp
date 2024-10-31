import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { addUpiId, deleteUpiId, getUpiId } from "../controllers/upiId.js";

const app = express.Router();

app
  .route("/upi")
  .get(adminOnly, getUpiId)
  .post(adminOnly, addUpiId)
  .delete(adminOnly, deleteUpiId);

export default app;
