import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        title: String,
        speaker: String,
        dateTime: Date,
        meetingLink: String,
        roomId: String,
        meetingStatus: {
            type: String,
            enum: ["scheduled", "live", "ended"],
            default: "scheduled",
        },
        startedAt: Date,
        location: String,
        tag: String,
        duration: Number,
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true }
);

export default mongoose.model("Webinar", schema);