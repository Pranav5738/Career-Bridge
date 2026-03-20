import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        // Use custom IDs like w1, w2, w3 (matches frontend)
        _id: { type: String },
        title: String,
        speaker: String,
        dateTime: Date,
        tag: String,
        duration: Number,
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true }
);

export default mongoose.model("Webinar", schema);