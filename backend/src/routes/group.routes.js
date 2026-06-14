import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createGroup,addMember } from "../controllers/group.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createGroup);
router.post(
  "/:groupId/members",
  authMiddleware,
  addMember
);

export default router;