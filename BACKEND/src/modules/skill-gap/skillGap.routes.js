import express from "express";
import { analyzeSkillGap } from "./skillGap.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/analyze", authMiddleware, analyzeSkillGap);

export default router;