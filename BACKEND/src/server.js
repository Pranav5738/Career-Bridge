import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

const startServer = async () => {
    // ✅ Connect DB
    await connectDB();

    // ✅ Create HTTP server (IMPORTANT)
    const server = http.createServer(app);

    // ✅ Setup Socket.io
    const io = new Server(server, {
        cors: {
            origin: "*", // change later to frontend URL in production
        },
    });

    // ✅ Socket events
    io.on("connection", (socket) => {
        console.log("🔌 User connected:", socket.id);

        // Join room
        socket.on("join_room", (roomId) => {
            socket.join(roomId);
        });

        // Send message
        socket.on("send_message", (data) => {
            io.to(data.roomId).emit("receive_message", data);
        });

        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", socket.id);
        });
    });

    // ✅ Start server (IMPORTANT: use server.listen NOT app.listen)
    server.listen(env.port, () => {
        console.log(`🚀 Server running on port ${env.port}`);
    });
};

startServer();