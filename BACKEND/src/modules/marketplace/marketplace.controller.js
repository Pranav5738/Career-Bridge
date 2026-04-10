import { asyncHandler } from "../../utils/asyncHandler.js";
import {
    getMentorsService,
    saveMentorService,
    bookSessionService
} from "./marketplace.service.js";

export const getMentors = asyncHandler(async (req, res) => {
    const mentors = await getMentorsService();

    res.json({ mentors });
});

export const saveMentor = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { mentorId } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "User authentication required" });
    }

    const result = await saveMentorService(userId, mentorId);

    res.json({
        message: "Mentor saved",
        ...result
    });
});

export const bookSession = asyncHandler(async (req, res) => {
    const userId = req.user?._id || null;
    const { mentorId } = req.body;

    const booking = await bookSessionService(userId, mentorId);

    res.json({
        message: "Session booked successfully",
        booking: {
            id: booking._id,
            mentorId: booking.mentorId,
            status: booking.status,
            scheduledAt: booking.scheduledAt
        }
    });
});