import express from "express";
import {
    startInterview,
    endInterview,
    reviewInterview
} from "./interviews.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/start", authMiddleware, startInterview);
router.post("/end", authMiddleware, endInterview);
router.post("/review", authMiddleware, reviewInterview);

export default router;