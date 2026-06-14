import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createSettlement } from "../controllers/settlement.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createSettlement);

export default router;