import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        webinarId: { type: String, required: true }
    },
    { timestamps: true }
);

export default mongoose.model("WebinarRegistration", schema);