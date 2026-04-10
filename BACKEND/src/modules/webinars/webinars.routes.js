import express from "express";
import {
    createWebinar,
    getWebinars,
    registerWebinar,
    unregisterWebinar,
    getMyRegistrations,
    addToCalendar,
    deleteWebinar,
    startWebinarMeeting,
    getWebinarMeetingAccess,
    getWebinarRegistrations
} from "./webinars.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { createWebinarSchema } from "./webinars.schema.js";

const router = express.Router();

router.get("/", getWebinars);
router.post("/", authMiddleware, validate(createWebinarSchema), createWebinar);
router.post("/register", authMiddleware, registerWebinar);
router.post("/unregister", authMiddleware, unregisterWebinar);
router.get("/my-registrations", authMiddleware, getMyRegistrations);
router.post("/add-to-calendar", authMiddleware, addToCalendar);
router.post("/:webinarId/start", authMiddleware, startWebinarMeeting);
router.get("/:webinarId/meeting-access", authMiddleware, getWebinarMeetingAccess);
router.get("/:webinarId/registrations", authMiddleware, getWebinarRegistrations);
router.get("/registrations/:webinarId", authMiddleware, getWebinarRegistrations);
router.get("/registrations", authMiddleware, getWebinarRegistrations);
router.post("/delete", authMiddleware, deleteWebinar);
router.delete("/delete/:webinarId", authMiddleware, deleteWebinar);
router.delete("/:webinarId", authMiddleware, deleteWebinar);

export default router;