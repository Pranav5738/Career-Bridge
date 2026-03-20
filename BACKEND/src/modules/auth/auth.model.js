import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;