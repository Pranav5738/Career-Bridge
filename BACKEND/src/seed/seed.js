import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { connectDB } from "../config/db.js";
import User from "../modules/auth/auth.model.js";
import Webinar from "../modules/webinars/webinar.model.js";

const seed = async () => {
  await connectDB();

  const demoEmail = "demo@gmail.com";
  const demoPassword = "demo1234";
  const passwordHash = await bcrypt.hash(demoPassword, 10);

  await User.findOneAndUpdate(
    { email: demoEmail },
    {
      email: demoEmail,
      passwordHash,
      role: "student",
      status: "active",
      targetRole: "Software Engineer"
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );

  console.log("✅ Demo user seeded");
  console.log(`📧 Email: ${demoEmail}`);
  console.log(`🔑 Password: ${demoPassword}`);

  await mongoose.connection.close();
  process.exit(0);
};

seed();