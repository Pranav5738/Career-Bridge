import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

const normalizePort = (value) => {
    const parsed = Number.parseInt(String(value), 10);
    return Number.isNaN(parsed) ? 5000 : parsed;
};

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

        socket.on("meeting:join", async ({ roomId, userId, name }) => {
            if (!roomId) {
                return;
            }

            socket.data.meetingRoomId = roomId;
            socket.data.userId = userId || "";
            socket.data.name = name || "Participant";

            const socketsInRoom = await io.in(roomId).fetchSockets();
            const participants = socketsInRoom
                .filter((item) => item.id !== socket.id)
                .map((item) => ({
                    socketId: item.id,
                    userId: item.data.userId || "",
                    name: item.data.name || "Participant",
                }));

            socket.join(roomId);
            socket.emit("meeting:participants", { participants });

            socket.to(roomId).emit("meeting:user-joined", {
                socketId: socket.id,
                userId: socket.data.userId,
                name: socket.data.name,
            });
        });

        socket.on("meeting:offer", ({ to, offer, roomId, meta }) => {
            if (!to || !offer) {
                return;
            }

            io.to(to).emit("meeting:offer", {
                from: socket.id,
                offer,
                roomId,
                meta: meta || {},
            });
        });

        socket.on("meeting:answer", ({ to, answer, roomId }) => {
            if (!to || !answer) {
                return;
            }

            io.to(to).emit("meeting:answer", {
                from: socket.id,
                answer,
                roomId,
            });
        });

        socket.on("meeting:ice-candidate", ({ to, candidate, roomId }) => {
            if (!to || !candidate) {
                return;
            }

            io.to(to).emit("meeting:ice-candidate", {
                from: socket.id,
                candidate,
                roomId,
            });
        });

        socket.on("disconnect", () => {
            if (socket.data?.meetingRoomId) {
                socket.to(socket.data.meetingRoomId).emit("meeting:user-left", {
                    socketId: socket.id,
                });
            }
            console.log("❌ User disconnected:", socket.id);
        });
    });

    const port = normalizePort(env.port);

    server.on("error", (error) => {
        if (error?.code === "EADDRINUSE") {
            console.log(`⚠️ Port ${port} is already in use. Backend is likely already running.`);
            process.exit(0);
            return;
        }

        console.error("❌ Server startup failed:", error.message || error);
        process.exit(1);
    });

    // ✅ Start server (IMPORTANT: use server.listen NOT app.listen)
    server.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
    });
};

startServer().catch((error) => {
    console.error("❌ Failed to initialize backend:", error.message || error);
    process.exit(1);
});