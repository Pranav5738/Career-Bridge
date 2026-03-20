import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../modules/auth/auth.model.js";
import Webinar from "../modules/webinars/webinar.model.js";

const seed = async () => {
  await connectDB();

  await User.deleteMany();
  await Webinar.deleteMany();

  // Mentors
  const mentors = await User.insertMany([
    {
      email: "m1@test.com",
      passwordHash: "hashed",
      role: "mentor",
      expertise: "React"
    },
    {
      email: "m2@test.com",
      passwordHash: "hashed",
      role: "mentor",
      expertise: "Node.js"
    },
    {
      email: "m3@test.com",
      passwordHash: "hashed",
      role: "mentor",
      expertise: "AI/ML"
    },
    {
      email: "m4@test.com",
      passwordHash: "hashed",
      role: "mentor",
      expertise: "System Design"
    }
  ]);

  // Webinars
  await Webinar.insertMany([
    {
      title: "React Mastery",
      speaker: "John",
      dateTime: new Date(),
      tag: "Frontend",
      duration: 60
    },
    {
      title: "Backend Scaling",
      speaker: "Jane",
      dateTime: new Date(),
      tag: "Backend",
      duration: 90
    },
    {
      title: "AI Basics",
      speaker: "Alex",
      dateTime: new Date(),
      tag: "AI",
      duration: 75
    }
  ]);

  console.log("✅ Seed data inserted");
  process.exit();
};

seed();