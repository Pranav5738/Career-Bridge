import SavedMentor from "./savedMentor.model.js";
import Booking from "./booking.model.js";
import User from "../auth/auth.model.js";
import { AppError } from "../../utils/AppError.js";

const findMentorById = async (mentorId) => {
    return await User.findById(mentorId).lean();
};

const buildMentorName = (email) => {
    if (!email) {
        return "Mentor";
    }

    return email
        .split("@")[0]
        .split(/[._-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ") || "Mentor";
};

const buildMentorAvatar = (name) => {
    const parts = String(name || "M").split(" ").filter(Boolean);
    const first = parts[0]?.[0] ?? "M";
    const second = parts[1]?.[0] ?? "";
    return (first + second).toUpperCase();
};

const deriveMentorPrice = (mentor) => {
    const text = `${mentor?.membershipPlan || ""} ${mentor?.expertise || ""}`.toLowerCase();

    if (text.includes("premium") || text.includes("staff") || text.includes("principal")) {
        return 79;
    }

    if (text.includes("senior") || text.includes("lead") || text.includes("architecture")) {
        return 69;
    }

    if (text.includes("system design") || text.includes("backend") || text.includes("frontend")) {
        return 59;
    }

    return 49;
};

const formatMentor = (mentor) => {
    const name = buildMentorName(mentor.email);
    const expertise = mentor.expertise || mentor.targetRole || "Career Mentor";
    const tags = [mentor.expertise, mentor.targetRole, mentor.membershipPlan]
        .filter(Boolean)
        .map((value) => String(value).trim())
        .filter(Boolean)
        .slice(0, 3);

    return {
        id: mentor._id,
        name,
        title: mentor.expertise ? `${expertise} Mentor` : `${expertise}`,
        tags: tags.length ? tags : ["Career", "Interview", "Growth"],
        rating: 4.8,
        price: deriveMentorPrice(mentor),
        avatar: buildMentorAvatar(name),
    };
};

export const getMentorsService = async () => {
    const mentors = await User.find({ role: "mentor" })
        .select("_id email role expertise targetRole membershipPlan location skills")
        .lean();

    return mentors.map(formatMentor);
};

export const saveMentorService = async (userId, mentorId) => {
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }

    const mentor = await findMentorById(mentorId);

    if (!mentor || mentor.role !== "mentor") {
        throw new AppError("Mentor not found", 404);
    }

    const savedMentor = await SavedMentor.findOneAndUpdate(
        { userId, mentorId },
        { userId, mentorId },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return {
        savedMentor: {
            id: savedMentor._id,
            mentorId: savedMentor.mentorId,
            createdAt: savedMentor.createdAt
        }
    };
};

export const bookSessionService = async (userId, mentorId) => {
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }

    const mentor = await findMentorById(mentorId);

    if (!mentor || mentor.role !== "mentor") {
        throw new AppError("Mentor not found", 404);
    }

    const booking = await Booking.create({
        studentId: userId,
        mentorId,
        priceSnapshot: deriveMentorPrice(mentor)
    });

    return booking;
};