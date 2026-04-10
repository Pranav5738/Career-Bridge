import express from "express";
import {
    startInterview,
    endInterview,
    reviewInterview,
    getDailyDsaQuestions,
    getDsaQuestionById,
    evaluateDsaCode
} from "./interviews.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/start", authMiddleware, startInterview);
router.post("/end", authMiddleware, endInterview);
router.post("/review", authMiddleware, reviewInterview);
router.post("/evaluate", authMiddleware, evaluateDsaCode);
router.get("/daily-dsa", authMiddleware, getDailyDsaQuestions);
router.get("/daily-dsa/:questionId", authMiddleware, getDsaQuestionById);

export default router;