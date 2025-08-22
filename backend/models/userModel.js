import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    image: {
      type: String, // This will store image URL or filename
      default: "", // Optional: default value can be an empty string
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
