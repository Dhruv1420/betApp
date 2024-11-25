import express from "express";
import {
  activeAllUsers,
  deleteUser,
  getActiveUsers,
  getAllUsers,
  getMyProfile,
  getUser,
  login,
  logout,
  myReferrals,
  register,
  updateUser,
} from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

app.post("/new", register);
app.post("/login", login);

// app.use(isAuthenticated);

app.get("/me", getMyProfile);

app.post("/myreferrals", myReferrals);

app.use("/logout", logout);

app.get("/all", adminOnly, getAllUsers);

app.get("/active", adminOnly, getActiveUsers);

app.get("/activeusers", adminOnly, activeAllUsers);

app.route("/:id").get(getUser).put(updateUser).delete(adminOnly, deleteUser);

export default app;
