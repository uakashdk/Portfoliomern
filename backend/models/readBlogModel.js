import mongoose from "mongoose";

const readBlogSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  blogId: {
    type: String,
    ref: "Blog",
    required: true,
  },
  readAt: {
    type: Date,
    default: Date.now,
  },
});

const ReadBlog = mongoose.model("recomendBlog", readBlogSchema);

export default ReadBlog;
