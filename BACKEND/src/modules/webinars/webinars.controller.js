import { asyncHandler } from "../../utils/asyncHandler.js";
import {
    createWebinarService,
    getWebinarsService,
    registerWebinarService,
    unregisterWebinarService,
    getMyRegistrationsService,
    addToCalendarService,
    deleteWebinarService,
    startWebinarMeetingService,
    getWebinarMeetingAccessService,
    getWebinarRegistrationsService
} from "./webinars.service.js";

export const createWebinar = asyncHandler(async (req, res) => {
    if (req.user?.role !== "mentor") {
        return res.status(403).json({ message: "Only mentors can create webinars" });
    }

    const webinar = await createWebinarService({
        userId: req.user._id,
        ...req.body,
    });

    res.status(201).json({
        message: "Webinar created",
        webinar,
    });
});

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

export const unregisterWebinar = asyncHandler(async (req, res) => {
    const userId = req.user?._id || null;
    const { webinarId } = req.body;

    const registration = await unregisterWebinarService(userId, webinarId);

    res.json({
        message: "Unregistered",
        registration
    });
});

export const getMyRegistrations = asyncHandler(async (req, res) => {
    const userId = req.user?._id || null;
    const webinarIds = await getMyRegistrationsService(userId);

    res.json({ webinarIds });
});

export const addToCalendar = asyncHandler(async (req, res) => {
    const { webinarId } = req.body;

    const calendarEvent = await addToCalendarService(webinarId);

    res.json({
        message: "Added to calendar",
        calendarEvent
    });
});

export const deleteWebinar = asyncHandler(async (req, res) => {
    const webinarId = req.params?.webinarId || req.body?.webinarId;

    if (!webinarId) {
        return res.status(400).json({ message: "webinarId is required" });
    }

    const result = await deleteWebinarService({
        webinarId,
        userId: req.user?._id,
        role: req.user?.role,
    });

    res.json({
        message: "Webinar deleted",
        result,
    });
});

export const startWebinarMeeting = asyncHandler(async (req, res) => {
    const webinarId = req.params?.webinarId;

    const webinar = await startWebinarMeetingService({
        webinarId,
        userId: req.user?._id,
        role: req.user?.role,
    });

    res.json({
        message: "Meeting started",
        webinar,
    });
});

export const getWebinarMeetingAccess = asyncHandler(async (req, res) => {
    const webinarId = req.params?.webinarId;

    const access = await getWebinarMeetingAccessService({
        webinarId,
        userId: req.user?._id,
        role: req.user?.role,
    });

    res.json({
        message: "Meeting access granted",
        access,
    });
});

export const getWebinarRegistrations = asyncHandler(async (req, res) => {
    const webinarId = req.params?.webinarId || req.query?.webinarId || req.body?.webinarId;

    if (!webinarId) {
        return res.status(400).json({ message: "webinarId is required" });
    }

    const result = await getWebinarRegistrationsService({
        webinarId,
        userId: req.user?._id,
        role: req.user?.role,
    });

    res.json({
        message: "Registrations fetched",
        webinar: result.webinar,
        registrations: result.registrations,
    });
});