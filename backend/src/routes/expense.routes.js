import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createExpense } from "../controllers/expense.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createExpense);

export default router;