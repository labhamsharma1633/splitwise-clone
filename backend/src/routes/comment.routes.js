import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { addComment, getComments } from "../controllers/comment.controller.js";

const router = express.Router();

router.post(
  "/expenses/:expenseId/comments",
  authMiddleware,
  addComment
);

router.get(
  "/expenses/:expenseId/comments",
  authMiddleware,
  getComments
);

export default router;