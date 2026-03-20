import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    mentorId: { type: String, required: true }, // matches m1..m4
    scheduledAt: { type: Date, default: Date.now },
    durationMinutes: { type: Number, default: 60 },
    status: { type: String, default: "confirmed" },
    priceSnapshot: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", schema);