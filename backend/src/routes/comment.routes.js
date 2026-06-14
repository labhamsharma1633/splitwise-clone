import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { addComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post(
  "/expenses/:expenseId/comments",
  authMiddleware,
  addComment
);

export default router;