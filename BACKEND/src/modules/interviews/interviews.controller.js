import { asyncHandler } from "../../utils/asyncHandler.js";
import {
    startInterviewService,
    endInterviewService,
    reviewInterviewService,
    getDailyDsaQuestionsService,
    getDsaQuestionByIdService,
    evaluateDsaCodeService
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

export const getDailyDsaQuestions = asyncHandler(async (_req, res) => {
    const payload = getDailyDsaQuestionsService();

    res.json({
        message: "Daily DSA questions fetched",
        ...payload
    });
});

export const getDsaQuestionById = asyncHandler(async (req, res) => {
    const question = getDsaQuestionByIdService(req.params.questionId);

    if (!question) {
        res.status(404).json({ message: "Question not found" });
        return;
    }

    res.json({
        message: "DSA question fetched",
        question
    });
});

export const evaluateDsaCode = asyncHandler(async (req, res) => {
    const { questionId, language, code, action = "run" } = req.body || {};

    if (!questionId || !language || !code) {
        res.status(400).json({
            message: "questionId, language, and code are required"
        });
        return;
    }

    if (!["run", "submit"].includes(action)) {
        res.status(400).json({
            message: "action must be either 'run' or 'submit'"
        });
        return;
    }

    const question = getDsaQuestionByIdService(questionId);
    if (!question) {
        res.status(404).json({ message: "Question not found" });
        return;
    }

    const evaluation = await evaluateDsaCodeService({
        question,
        language,
        code,
        action
    });

    res.json({
        message: action === "submit" ? "Submission evaluated" : "Run evaluated",
        evaluation
    });
});