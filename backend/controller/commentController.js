// controllers/commentController.js

import Comment from "../models/commentModel.js";

// Add a reply to a specific comment
export const replyToComment = async (req, res) => {
  try {
    const { text } = req.body; // The reply text
    const { commentId } = req.params; // The ID of the comment being replied to

    // Ensure the user is logged in
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "You must be logged in to reply" });
    }

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Create the reply
    const reply = {
      text,
      author: req.user.name,
      userId: req.user.id,
    };

    // Add the reply to the comment's replies array
    comment.replies.push(reply);
    await comment.save();

    res.status(201).json({ message: "Reply added successfully", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { userId, commentText } = req.body;
    // Add your logic for saving the comment in the database
    const comment = await CommentModel.create({
      user: userId,
      text: commentText,
    });

    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchComments = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate("user").exec();
    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
