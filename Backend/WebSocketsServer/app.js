const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const Redis = require("ioredis");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"], // Allow only GET and POST requests
    allowedHeaders: ["Content-Type"], // Allow Content-Type headers
    credentials: true, // Allow cookies and authentication headers
  },
});

const redis = new Redis();

const userSockets = {}; // Store user socket IDs

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    const timestamp = new Date().toISOString(); // Get current timestamp
    socket.userId = userId; // Store userId on socket
    userSockets[userId] = socket.id;
    console.log(`User ${userId} joined at ${timestamp}`);

    // Fetch and send queued messages from Redis
    redis.lrange(`queue:${userId}`, 0, -1, (err, messages) => {
      if (messages.length > 0) {
        messages.forEach((msg) => {
          socket.emit("message", JSON.parse(msg));
        });
        redis.del(`queue:${userId}`); // Clear queue
      }
    });
  });

  socket.on("join_group", ({ group }) => {
    const timestamp = new Date().toISOString(); // Get current timestamp
    socket.join(group); // Use the group name directly as the room
    console.log(`User joined group ${group} at ${timestamp}`);
  });

  // Send a message to the group with name, email, and text
  socket.on("message", ({ group, name, email, text }) => {
    socket.broadcast.to(group).emit("message", { group, name, email, text });
    console.log(`Group Message from ${name} in ${group}: ${text}`);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSockets[socket.userId];
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
