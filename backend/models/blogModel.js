import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    code: { type: String, required: false },
    author: { type: String, required: true },
    Des: { type: String, required: true },
    slug: {
      type: String,
      unique: true, // Ensures uniqueness
      required: true, // Ensures slug is never null
    },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
