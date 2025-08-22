export const commentSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Listen for new comments
    socket.on("newComment", (data) => {
      console.log("New comment received:", data);
      // Broadcast the new comment to all connected clients
      io.emit("commentAdded", data);
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};
