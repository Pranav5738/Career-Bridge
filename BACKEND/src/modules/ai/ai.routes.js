import express from "express";
import { authMiddleware } from "../../middlewares/auth.js";
import { generatePlan } from "./ai.controller.js";

const router = express.Router();

router.post("/generate-plan", authMiddleware, generatePlan);

export default router;