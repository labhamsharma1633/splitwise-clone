import express from "express";
import upload from "../middleware/upload.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { importCSV } from "../controllers/import.controller.js";

const router = express.Router();

router.post(
  "/csv",
  authMiddleware,
  upload.single("file"),
  importCSV
);

export default router;