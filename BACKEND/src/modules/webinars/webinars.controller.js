import { asyncHandler } from "../../utils/asyncHandler.js";
import {
    getWebinarsService,
    registerWebinarService,
    addToCalendarService
} from "./webinars.service.js";

export const getWebinars = asyncHandler(async (req, res) => {
    const webinars = await getWebinarsService();
    res.json({ webinars });
});

export const registerWebinar = asyncHandler(async (req, res) => {
    const userId = req.user?._id || null;
    const { webinarId } = req.body;

    const registration = await registerWebinarService(userId, webinarId);

    res.json({
        message: "Registered",
        registration
    });
});

export const addToCalendar = asyncHandler(async (req, res) => {
    const { webinarId } = req.body;

    const calendarEvent = await addToCalendarService(webinarId);

    res.json({
        message: "Added to calendar",
        calendarEvent
    });
});