import express from "express";
import {
    getStudentDashboard,
    getMentorDashboard
} from "./dashboard.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/student", authMiddleware, getStudentDashboard);
router.get("/mentor", authMiddleware, getMentorDashboard);

export default router;