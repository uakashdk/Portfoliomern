import fs from "fs";
import Project from "../models/projectModel.js";
import { error } from "console";

export const createProjectController = async (req, res) => {
  try {
    // Sanitize incoming fields
    const sanitizeFields = (fields) => {
      const sanitized = {};
      Object.keys(fields).forEach((key) => {
        sanitized[key.trim()] = fields[key];
      });
      return sanitized;
    };

    const fields = sanitizeFields(req.fields);
    const { name, description, OutputUrl, GitHubUrl } = fields;
    const { photo } = req.files || {};

    // Debugging
    console.log("Sanitized fields:", fields);
    console.log("Received files:", req.files);

    // Validation
    if (!name || !description || !OutputUrl || !GitHubUrl) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (name, description, OutputUrl, GitHubUrl) are required",
      });
    }

    if (photo && photo.size > 1000000) {
      return res.status(400).json({
        success: false,
        message: "Photo size must be less than 1MB",
      });
    }

    // Create project
    const project = new Project({
      name: name.trim(),
      description: description.trim(),
      OutputUrl: OutputUrl.trim(),
      GitHubUrl: GitHubUrl.trim(),
    });

    // Handle photo
    if (photo) {
      project.photo.data = fs.readFileSync(photo.path);
      project.photo.contentType = photo.type;
    }

    // Save project
    await project.save();

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Error while creating project:", error.message);
    res.status(500).json({
      success: false,
      message: "Error while creating project",
      error: error.message,
    });
  }
};

// Get Controller

export const getProjectController = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      projects,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while fetching Project",
      error: error.message,
    });
  }
};

// Update Project Controller

export const updateProjectController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, OutputUrl, GitHubUrl } = req.fields;
    const { photo } = req.files || {};

    // Validation
    if (!name || !description || !OutputUrl || !GitHubUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the project
    const project = await Project.findById(id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Update fields
    project.name = name;
    project.description = description;
    project.OutputUrl = OutputUrl;
    project.GitHubUrl = GitHubUrl;

    // Handle photo update if provided
    if (photo) {
      if (photo.size > 1000000) {
        return res
          .status(400)
          .json({ message: "Photo size must be less than 1MB" });
      }
      project.photo.data = fs.readFileSync(photo.path);
      project.photo.contentType = photo.type;
    }

    // Save the updated project
    await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: "Error while updating project",
      error: error.message,
    });
  }
};

// Delete Controller

export const deleteProjectController = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(400).json({
        success: false,
        message: "Project not found",
        error: error.message,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Project Delete Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Error While Deleteing Project",
      error: error.message,
    });
  }
};
