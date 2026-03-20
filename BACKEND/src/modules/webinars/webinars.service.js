import Webinar from "./webinar.model.js";
import WebinarRegistration from "./webinarRegistration.model.js";

const webinarsSeed = [
    {
        title: "React Mastery",
        speaker: "John",
        dateTime: new Date(),
        tag: "Frontend",
        duration: 60
    },
    {
        title: "Backend Scaling",
        speaker: "Jane",
        dateTime: new Date(),
        tag: "Backend",
        duration: 90
    },
    {
        title: "AI Basics",
        speaker: "Alex",
        dateTime: new Date(),
        tag: "AI",
        duration: 75
    }
];

// Ensure seed exists in DB
export const ensureWebinars = async () => {
    const count = await Webinar.countDocuments();
    if (count === 0) {
        await Webinar.insertMany(webinarsSeed);
    }
};

export const getWebinarsService = async () => {
    await ensureWebinars();
    return Webinar.find().lean();
};

export const registerWebinarService = async (userId, webinarId) => {
    await WebinarRegistration.updateOne(
        { userId, webinarId },
        { userId, webinarId },
        { upsert: true }
    );

    return {
        id: `${userId || "guest"}_${webinarId}`,
        webinarId,
        status: "registered"
    };
};

export const addToCalendarService = async (webinarId) => {
    // Simple ICS mock (you can later generate real .ics file)
    return {
        id: `cal_${webinarId}`,
        webinarId,
        provider: "ics"
    };
};