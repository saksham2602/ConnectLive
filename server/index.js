const rooms = new Set();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomID) => {
    const isFirst = !rooms.has(roomID);
    socket.join(roomID);

    if (isFirst) {
      rooms.add(roomID);
    } else {
      socket.to(roomID).emit("user-joined", socket.id);
    }

    socket.emit("room-status", { exists: true });
    console.log(`User ${socket.id} joined room ${roomID}`);
  });

  socket.on("check-room", (roomID, callback) => {
    callback(rooms.has(roomID));
  });

  socket.on("disconnecting", () => {
    const socketRooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
    socketRooms.forEach((roomID) => {
      const room = io.sockets.adapter.rooms.get(roomID);
      if (!room || room.size === 1) {
        rooms.delete(roomID);
      }
    });
  });

  socket.on("signal", ({ roomID, data }) => {
    socket.to(roomID).emit("signal", { from: socket.id, data });
  });

  socket.on("chat-message", ({ roomID, user, text }) => {
    socket.to(roomID).emit("chat-message", { user, text });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

