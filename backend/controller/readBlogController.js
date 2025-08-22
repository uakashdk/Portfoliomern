import ReadBlog from "../models/readBlogModel.js";

export const addReadBlogController = async (req, res) => {
  try {
    const { userId, blogId } = req.body;
    if (!userId || !blogId) {
      return res.status(400).json({
        success: false,
        message: "Please provide both userId and blogId",
      });
    }

    // Check if the blog is already marked as read
    const alreadyRead = await ReadBlog.findOne({ userId, blogId });
    if (alreadyRead) {
      return res.status(200).json({
        success: true,
        message: "Blog already marked as read",
      });
    }

    // Create a new instance of ReadBlog
    const readBlog = new ReadBlog({ userId, blogId });

    // Save the instance to the database
    await readBlog.save();

    return res.status(201).json({
      success: true,
      message: "Blog marked as read successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while marking blog as read",
      error: error.message,
    });
  }
};

// Read Blog by user

export const getReadBlogbyUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const readBlog = await ReadBlog.find({ userId }).populate("blogId");

    if (!readBlog.length) {
      return res.status(404).json({
        success: true,
        message: "No read blogs found for the user",
        readBlog: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      readBlog,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching read blogs",
      error: error.message,
    });
  }
};
