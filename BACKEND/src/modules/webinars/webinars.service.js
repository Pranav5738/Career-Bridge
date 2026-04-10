import Webinar from "./webinar.model.js";
import WebinarRegistration from "./webinarRegistration.model.js";
import { AppError } from "../../utils/AppError.js";

const generateRoomId = (webinarId) => `wb-${String(webinarId)}-${Math.random().toString(36).slice(2, 10)}`;
const hasUrlScheme = (value) => /^[a-z][a-z0-9+.-]*:/i.test(String(value || "").trim());

export const getWebinarsService = async () => {
    return Webinar.aggregate([
        {
            $addFields: {
                webinarIdString: { $toString: "$_id" },
            },
        },
        {
            $lookup: {
                from: "webinarregistrations",
                localField: "webinarIdString",
                foreignField: "webinarId",
                as: "registrations",
            },
        },
        {
            $addFields: {
                registrationCount: { $size: "$registrations" },
                registrationsCount: { $size: "$registrations" },
            },
        },
        {
            $project: {
                webinarIdString: 0,
                registrations: 0,
            },
        },
        {
            $sort: { dateTime: 1, createdAt: -1 },
        },
    ]);
};

export const createWebinarService = async ({
    userId,
    title,
    speaker,
    dateTime,
    meetingLink,
    location,
    tag,
    duration
}) => {
    const webinar = await Webinar.create({
        title: String(title).trim(),
        speaker: String(speaker).trim(),
        dateTime: new Date(dateTime),
        meetingLink: String(meetingLink || "").trim(),
        location: String(location || "").trim(),
        tag: String(tag).trim(),
        duration: Number.isFinite(duration) ? duration : 60,
        createdBy: userId,
    });

    return webinar;
};

export const registerWebinarService = async (userId, webinarId) => {
    const webinar = await Webinar.findById(webinarId).select("_id").lean();

    if (!webinar) {
        throw new AppError("Webinar not found", 404);
    }

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

export const unregisterWebinarService = async (userId, webinarId) => {
    await WebinarRegistration.deleteOne({ userId, webinarId });

    return {
        id: `${userId || "guest"}_${webinarId}`,
        webinarId,
        status: "unregistered"
    };
};

export const getMyRegistrationsService = async (userId) => {
    const rows = await WebinarRegistration.find({ userId }).select("webinarId -_id").lean();
    return rows.map((row) => row.webinarId);
};

export const addToCalendarService = async (webinarId) => {
    // Simple ICS mock (you can later generate real .ics file)
    return {
        id: `cal_${webinarId}`,
        webinarId,
        provider: "ics"
    };
};

export const deleteWebinarService = async ({ webinarId, userId, role }) => {
    const webinar = await Webinar.findById(webinarId);

    if (!webinar) {
        const error = new Error("Webinar not found");
        error.status = 404;
        throw error;
    }

    if (role !== "mentor") {
        const error = new Error("Only mentors can delete webinars");
        error.status = 403;
        throw error;
    }

    if (String(webinar.createdBy) !== String(userId)) {
        const error = new Error("You can delete only webinars you created");
        error.status = 403;
        throw error;
    }

    await Webinar.deleteOne({ _id: webinarId });
    await WebinarRegistration.deleteMany({ webinarId: String(webinarId) });

    return {
        id: String(webinarId),
        status: "deleted",
    };
};

export const startWebinarMeetingService = async ({ webinarId, userId, role }) => {
    const webinar = await Webinar.findById(webinarId);

    if (!webinar) {
        const error = new Error("Webinar not found");
        error.status = 404;
        throw error;
    }

    if (role !== "mentor") {
        const error = new Error("Only mentors can start meetings");
        error.status = 403;
        throw error;
    }

    if (String(webinar.createdBy) !== String(userId)) {
        const error = new Error("Only the webinar creator can start this meeting");
        error.status = 403;
        throw error;
    }

    if (!webinar.roomId) {
        webinar.roomId = generateRoomId(webinar._id);
    }

    const customLink = String(webinar.meetingLink || "").trim();
    const internalMeetingLink = `/meeting/${webinar.roomId}?webinarId=${String(webinar._id)}`;

    webinar.meetingStatus = "live";
    webinar.startedAt = new Date();
    webinar.meetingLink = customLink && (hasUrlScheme(customLink) || customLink.startsWith("/"))
        ? customLink
        : internalMeetingLink;
    await webinar.save();

    return webinar;
};

export const getWebinarMeetingAccessService = async ({ webinarId, userId, role }) => {
    const webinar = await Webinar.findById(webinarId).lean();

    if (!webinar) {
        const error = new Error("Webinar not found");
        error.status = 404;
        throw error;
    }

    if (webinar.meetingStatus !== "live" || !webinar.roomId) {
        const error = new Error("Meeting has not started yet");
        error.status = 409;
        throw error;
    }

    const isOwnerMentor = role === "mentor" && String(webinar.createdBy) === String(userId);

    if (!isOwnerMentor) {
        const registration = await WebinarRegistration.findOne({
            userId,
            webinarId: String(webinar._id),
        })
            .select("_id")
            .lean();

        if (!registration) {
            const error = new Error("Register for this webinar to join the meeting");
            error.status = 403;
            throw error;
        }
    }

    return {
        webinarId: String(webinar._id),
        roomId: webinar.roomId,
        meetingLink: webinar.meetingLink,
        title: webinar.title,
        speaker: webinar.speaker,
        dateTime: webinar.dateTime,
        location: webinar.location || "",
    };
};

export const getWebinarRegistrationsService = async ({ webinarId, userId, role }) => {
    const webinar = await Webinar.findById(webinarId).select("_id title createdBy").lean();

    if (!webinar) {
        throw new AppError("Webinar not found", 404);
    }

    if (role !== "mentor") {
        throw new AppError("Only mentors can view registrations", 403);
    }

    if (String(webinar.createdBy) !== String(userId)) {
        throw new AppError("You can view registrations only for webinars you created", 403);
    }

    const rows = await WebinarRegistration.find({ webinarId: String(webinar._id) })
        .populate("userId", "_id name email role status targetRole expertise")
        .sort({ createdAt: -1 })
        .lean();

    const registrations = rows.map((row) => {
        const hasPopulatedUser = row?.userId && typeof row.userId === "object" && row.userId.email;
        const user = hasPopulatedUser ? row.userId : null;

        return {
            id: String(row?._id || ""),
            registeredAt: row?.createdAt,
            user: {
                id: user?._id ? String(user._id) : "",
                name: user?.name || "",
                email: user?.email || "",
                role: user?.role || "student",
                status: user?.status || "",
                targetRole: user?.targetRole || "",
                expertise: user?.expertise || "",
            },
        };
    });

    return {
        webinar: {
            id: String(webinar._id),
            title: webinar.title,
        },
        registrations,
    };
};