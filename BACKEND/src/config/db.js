import mongoose from "mongoose";
import { env } from "./env.js";

const normalizeMongoUri = (uri) => {
    if (!uri) {
        return uri;
    }

    const queryIndex = uri.indexOf("?");
    const base = queryIndex === -1 ? uri : uri.slice(0, queryIndex);
    const query = queryIndex === -1 ? "" : uri.slice(queryIndex);

    const lastSlash = base.lastIndexOf("/");
    if (lastSlash === -1 || lastSlash === base.length - 1) {
        return uri;
    }

    const prefix = base.slice(0, lastSlash + 1);
    const dbName = base.slice(lastSlash + 1);

    // Preserve already encoded names and encode plain spaces/special chars.
    const encodedDbName = encodeURIComponent(decodeURIComponent(dbName));
    return `${prefix}${encodedDbName}${query}`;
};

export const connectDB = async () => {
    try {
        await mongoose.connect(normalizeMongoUri(env.mongoUri));

        console.log("✅ MongoDB connected");
    } catch (error) {
        console.error("❌ MongoDB connection failed", error);
        process.exit(1);
    }
};