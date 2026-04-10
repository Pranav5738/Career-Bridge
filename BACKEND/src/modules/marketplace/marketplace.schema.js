import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    mentorId: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("SavedMentor", schema);