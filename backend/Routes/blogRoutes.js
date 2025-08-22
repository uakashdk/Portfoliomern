import express from "express";
import {
  createBlogController,
  deleteBlogController,
  getBlogController,
  getSingleBlogController,
  updateBlogController,
} from "../controller/blogController.js";

const router = express.Router();

// Route to create a new blog
router.post("/create-blog", createBlogController);

// Route to get all blogs
router.get("/blogs", getBlogController);

// Route to get a single blog by ID

router.get("/blog/:id", getSingleBlogController);

// Route to update a blog
router.put("/update-blog/:id", updateBlogController);

// Route to delete a blog
router.delete("/delete-blog/:id", deleteBlogController);

export default router;
