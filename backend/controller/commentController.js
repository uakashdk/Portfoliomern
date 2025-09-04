import Comment from "../models/commentModel.js";

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { blogId } = req.params;

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const comment = await Comment.create({
      blogId,
      text,
      author: req.user.name || "Anonymous", // name from JWT payload (set in middleware)
      userId: req.user._id, // user id from JWT payload
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reply to a specific comment
export const replyToComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { commentId } = req.params;

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "You must be logged in to reply" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const reply = {
      text,
      author: req.user.name || "Anonyms",
      userId: req.user._id, // 👈 fix here
    };

    comment.replies.push(reply);
    await comment.save();

    res
      .status(201)
      .json({ success: true, message: "Reply added successfully", comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch all comments for a blog
export const fetchComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blogId })
      .populate("userId", "name email")
      .populate("replies.userId", "name email");

    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
