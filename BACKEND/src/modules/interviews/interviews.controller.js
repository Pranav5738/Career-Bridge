import { asyncHandler } from "../../utils/asyncHandler.js";
import {
    startInterviewService,
    endInterviewService,
    reviewInterviewService
} from "./interviews.service.js";

export const startInterview = asyncHandler(async (req, res) => {
    const userId = req.user?._id || null;
    const { mode } = req.body;

    const session = await startInterviewService(userId, mode);

    res.json({
        message: "Mock interview started",
        session: {
            id: session._id,
            mode: session.mode,
            startedAt: session.startedAt,
            status: session.status
        }
    });
});

export const endInterview = asyncHandler(async (req, res) => {
    const userId = req.user?._id || null;
    const { mode } = req.body;

    const session = await endInterviewService(userId, mode);

    res.json({
        message: "Session ended and saved",
        session: {
            id: session._id,
            mode: session.mode,
            endedAt: session.endedAt,
            status: session.status
        }
    });
});

export const reviewInterview = asyncHandler(async (req, res) => {
    const userId = req.user?._id || null;
    const { mode } = req.body;

    const requestId = await reviewInterviewService(userId, mode);

    res.json({
        message: "Mentor review requested",
        requestId
    });
});