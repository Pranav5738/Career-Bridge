import express from "express";
import {
    getWebinars,
    registerWebinar,
    addToCalendar
} from "./webinars.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/", getWebinars);
router.post("/register", authMiddleware, registerWebinar);
router.post("/add-to-calendar", addToCalendar);

export default router;