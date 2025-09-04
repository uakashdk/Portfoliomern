export const commentSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Listen for new comments
    socket.on("newComment", async (data) => {
      const newComment = await Comment.create({
        blogId: data.blogId,
        text: data.text,
        author: data.author,
        userId: data.userId,
      });
      io.emit("commentAdded", newComment);
    });

    socket.emit("commentError", { message: "Failed to save comment" });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};
