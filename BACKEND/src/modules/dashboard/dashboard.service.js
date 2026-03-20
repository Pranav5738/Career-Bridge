import Booking from "../marketplace/booking.model.js";
import ResumeAnalysis from "../resume/resumeAnalysis.model.js";
import InterviewSession from "../interviews/interviewSession.model.js";

export const studentDashboardService = async (userId) => {
    const sessions = await Booking.countDocuments({ studentId: userId });

    const resume = await ResumeAnalysis.findOne({ userId })
        .sort({ createdAt: -1 });

    const interviews = await InterviewSession.countDocuments({ userId });

    return {
        sessions,
        resumeScore: resume ? resume.score : 0,
        interviews
    };
};

export const mentorDashboardService = async (userId) => {
    const sessions = await Booking.countDocuments({ mentorId: userId });

    const earnings = sessions * 500; // mock

    return {
        sessions,
        earnings,
        rating: 4.7 // mock
    };
};