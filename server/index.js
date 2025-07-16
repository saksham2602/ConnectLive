const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomID) => {
    socket.join(roomID);
    socket.to(roomID).emit("user-joined", socket.id);
    console.log(`User ${socket.id} joined room ${roomID}`);
  });

  socket.on("signal", ({ roomID, data }) => {
    socket.to(roomID).emit("signal", { from: socket.id, data });
  });

  socket.on("chat-message", ({ roomID, user, text }) => {
    socket.to(roomID).emit("chat-message", { user, text });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    socket.broadcast.emit("user-left", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

