import blogModel from "../models/blogModel.js";
import slugify from "slugify";

export const createBlogController = async (req, res) => {
  try {
    const { title, content, code, author, Des } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }
    if (!content) {
      return res.status(400).json({
        message: "Content is required",
      });
    }
    if (!code) {
      return res.status(400).json({
        message: "Code is required",
      });
    }
    if (!author) {
      return res.status(400).json({
        message: "Author is required",
      });
    }
    if (!Des) {
      return res.status(400).json({
        message: "Description is required is required",
      });
    }

    // Generate a unique slug
    let slug = title ? slugify(title, { lower: true }) : `blog-${Date.now()}`;
    const existingSlug = await blogModel.findOne({ slug });
    if (existingSlug) {
      // Append a unique identifier to the slug
      slug = `${slug}-${Date.now()}`;
    }

    // Create a new blog
    const newBlog = new blogModel({
      title,
      content,
      code,
      slug,
      author,
      Des,
    });

    // Save the blog to the database
    await newBlog.save();

    res.status(200).json({
      success: true,
      message: "Blog created successfully",
      newBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error.message);
    res.status(500).json({
      success: false,
      message: "Error while creating blog",
      error: error.message,
    });
  }
};

// Get All Blogs Controller
export const getBlogController = async (req, res) => {
  try {
    const blogs = await blogModel.find();
    res
      .status(200)
      .json({ success: true, message: "Blogs retrieved successfully", blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

// Get Blog by ID or Slug (Optional: Detailed Photo Data)
export const getSingleBlogController = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const trimmedId = id.trim(); // Remove any leading or trailing whitespace from the ID

    const blog = await blogModel.findOne({ _id: trimmedId }); // Find blog by ID

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Structure and send the response
    res.status(200).json({
      success: true,
      message: "Blog retrieved successfully",
      blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error.message);
    res.status(500).json({
      success: false,
      message: "Error while fetching blog",
      error: error.message,
    });
  }
};

// Update Blog Controller

export const updateBlogController = async (req, res) => {
  try {
    const { id } = req.params; // Blog ID from URL
    const { title, content, code, author, Des } = req.body; // Data from request body

    console.log("Received ID:", id);
    console.log("Received Data:", { title, content, code, author, Des });

    // Validate the ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format",
      });
    }

    // Validate required fields
    if (!title || !content || !code) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and code are required.",
      });
    }

    // Find and update the blog
    const updatedBlog = await blogModel.findByIdAndUpdate(
      id,
      {
        title,
        content,
        code,
        slug: slugify(title, { lower: true }),
        author, // Ensure author is updated if provided
        Des, // Ensure Des is updated if provided
      },
      { new: true } // Return the updated document
    );

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating blog",
      error: error.message,
    });
  }
};

// Dlete Blog contoller

export const deleteBlogController = async (req, res) => {
  try {
    const { id } = req.params; // Blog ID from URL

    // Find and delete the blog
    const blog = await blogModel.findByIdAndDelete(id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};
