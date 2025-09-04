// routes/commentRoutes.js
import express from "express";
import { authenticateUser } from "../middleware/authenticationUser.js";
import {
  addComment,
  replyToComment,
  fetchComments,
} from "../controller/commentController.js";

const router = express.Router();

router.post("/:blogId/comments", authenticateUser, addComment);

router.post("/comments/:commentId/reply", authenticateUser, replyToComment);

router.get("/:blogId/comments", fetchComments);

export default router;
