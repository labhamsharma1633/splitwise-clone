import express from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", (req, res) => {
  res.json({
    success: true,
    message: "Login route reached",
  });
});
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth routes working",
  });
});
export default router;