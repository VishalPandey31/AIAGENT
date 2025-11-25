import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import { generateResult } from './services/ai.service.js';

const port = process.env.PORT || 3000;

// -------------------------
// ENV CHECKS
// -------------------------
if (!process.env.JWT_SECRET) {
    console.error("❌ ERROR: JWT_SECRET missing in .env");
    process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY missing in .env");
    process.exit(1);
}

// -------------------------
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

// -------------------------
// SOCKET AUTH MIDDLEWARE
// -------------------------
io.use(async (socket, next) => {
    try {
        const authHeader = socket.handshake.headers.authorization;

        const token =
            socket.handshake.auth?.token ||
            (authHeader ? authHeader.split(" ")[1] : null);

        const projectId = socket.handshake.query.projectId;

        if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error("Invalid projectId"));
        }

        const project = await projectModel.findById(projectId);
        if (!project) return next(new Error("Project not found"));

        socket.project = project;

        if (!token) {
            return next(new Error("Authentication error: Token missing"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;

        next();
    } catch (error) {
        console.error("Socket Auth Error:", error.message);
        next(new Error("Authentication failed"));
    }
});

// -------------------------
// SOCKET EVENTS
// -------------------------
io.on("connection", socket => {
    socket.roomId = socket.project._id.toString();

    console.log("✅ User connected:", socket.user.email);

    socket.join(socket.roomId);

    socket.on("project-message", async data => {
        const message = data.message;
        const aiIsPresent = message.includes("@ai");

        // Broadcast user message to other users
        socket.broadcast.to(socket.roomId).emit("project-message", data);

        // -------------------------
        // AI MESSAGE TRIGGER
        // -------------------------
        if (aiIsPresent) {
            const prompt = message.replace("@ai", "").trim();

            let result = await generateResult(prompt);

            // Extract text if AI returned { text: "..."}
            let text = result?.text || result;

            // Remove ``` or ```json markdown blocks
            text = String(text)
                .replace(/```json/gi, "")
                .replace(/```+/g, "")
                .trim();

            // Emit AI response
            io.to(socket.roomId).emit("project-message", {
                message: text,
                sender: {
                    _id: "ai",
                    email: "AI"
                }
            });

            return;
        }
    });

    socket.on("disconnect", () => {
        console.log("❌ User disconnected");
        socket.leave(socket.roomId);
    });
});

// -------------------------
server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
