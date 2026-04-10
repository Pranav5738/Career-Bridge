import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["student", "mentor"],
      required: true
    },
    status: {
      type: String
    },
    targetRole: {
      type: String
    },
    expertise: {
      type: String
    },
    github: {
      type: String
    },
    location: {
      type: String
    },
    membershipPlan: {
      type: String
    },
    skills: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;