import InterviewSession from "./interviewSession.model.js";

export const startInterviewService = async (userId, mode) => {
    const session = await InterviewSession.create({
        userId,
        mode,
        startedAt: new Date(),
        status: "running"
    });

    return session;
};

export const endInterviewService = async (userId, mode) => {
    const session = await InterviewSession.findOne({
        userId,
        mode,
        status: "running"
    }).sort({ createdAt: -1 });

    if (!session) {
        throw new Error("No active session found");
    }

    session.endedAt = new Date();
    session.status = "completed";
    await session.save();

    return session;
};

export const reviewInterviewService = async (userId, mode) => {
    const session = await InterviewSession.findOne({
        userId,
        mode
    }).sort({ createdAt: -1 });

    if (!session) {
        throw new Error("Session not found");
    }

    session.reviewRequested = true;
    await session.save();

    return session._id;
};