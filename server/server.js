const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const firebase = require("./firebase");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const chatRoutes = require("./chatRoutes");
const authRoutes = require("./authRoutes");
const groupRoutes = require("./groupRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/group", groupRoutes);

// WebSocket Connection
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("sendMessage", (message) => {
        io.emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
