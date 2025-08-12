// routes/commentRoutes.js
import express from "express";
import { authenticateUser } from "../middleware/authenticationUser.js";
import {
  addComment,
  replyToComment,
  fetchComments,
} from "../controller/commentController.js";

const router = express.Router();

// Add a comment (requires authentication)
router.post("/add-comment", authenticateUser, addComment);

// Reply to a comment by its ID (requires authentication)
router.post("/:commentId/reply", authenticateUser, replyToComment);

// Fetch all comments
router.get("/fetch-comment", fetchComments);

export default router;


// /api/v1/blog/blogs
