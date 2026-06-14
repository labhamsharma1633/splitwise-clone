import express from "express";
import { register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Auth route working",
  });
});

export default router;