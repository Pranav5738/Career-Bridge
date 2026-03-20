export const mentors = [
    { id: "m1", name: "Rahul (React)", rating: 4.8, price: 499 },
    { id: "m2", name: "Amit (DSA)", rating: 4.7, price: 399 },
    { id: "m3", name: "Sneha (ML)", rating: 4.9, price: 699 },
    { id: "m4", name: "Karan (System Design)", rating: 4.6, price: 599 }
];

import SavedMentor from "./savedMentor.model.js";
import Booking from "./booking.model.js";

const findMentorById = (mentorId) => mentors.find((mentor) => mentor.id === mentorId);

export const getMentorsService = async () => mentors;

export const saveMentorService = async (userId, mentorId) => {
    if (!userId) {
        const err = new Error("Unauthorized");
        err.status = 401;
        throw err;
    }

    const mentor = findMentorById(mentorId);

    if (!mentor) {
        const err = new Error("Mentor not found");
        err.status = 404;
        throw err;
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
        const err = new Error("Unauthorized");
        err.status = 401;
        throw err;
    }

    const mentor = findMentorById(mentorId);

    if (!mentor) {
        const err = new Error("Mentor not found");
        err.status = 404;
        throw err;
    }

    const booking = await Booking.create({
        studentId: userId,
        mentorId,
        priceSnapshot: mentor.price
    });

    return booking;
};