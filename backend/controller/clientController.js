import { error } from "console";
import Client from "../models/clientModel.js";
import fs from "fs";

export const createClientController = async (req, res) => {
  try {
    // Check if req.fields and req.files exist
    if (!req.fields || typeof req.fields !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing form data.",
      });
    }

    const sanitizeFields = (fields) => {
      const sanitized = {};
      Object.keys(fields).forEach((key) => {
        sanitized[key.trim()] = fields[key]?.trim();
      });
      return sanitized;
    };

    const fields = sanitizeFields(req.fields);
    const { name, projectName, projectDescription, star } = fields;
    const photo = req.files?.photo;

    // Validate required fields
    if (!name || !projectName || !projectDescription || !star) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate photo size (if photo is provided)
    if (photo && photo.size > 1000000) {
      return res.status(400).json({
        success: false,
        message: "Image size should be less than 1MB",
      });
    }

    // Create a new client instance
    const client = new Client({
      name,
      projectName,
      projectDescription,
      star,
    });

    // Handle photo upload
    if (photo) {
      client.photo = {
        data: fs.readFileSync(photo.path),
        contentType: photo.type,
      };
    }

    // Save client to the database
    await client.save();

    res.status(200).json({
      success: true,
      message: "Client added successfully",
      client,
    });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({
      success: false,
      message: "Error while creating client",
      error: error.message,
    });
  }
};

// get client

export const getClientController = async (req, res) => {
  try {
    const client = await Client.find();
    return res.status(200).json({
      success: true,
      messsage: "Client fetched successfully",
      client,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Error while fetching client",
      error: error.message,
    });
  }
};

// Update Client

export const updateClientController = async (req, res) => {
  try {
    const { id } = req.params; // Extract client ID from request parameters
    const { name, projectName, projectDescription, star } = req.fields;
    const { photo } = req.files || {};

    // Validate required fields
    if (!name || !projectName || !projectDescription || !star) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find the client by ID
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Update client fields
    client.name = name.trim();
    client.projectName = projectName.trim();
    client.projectDescription = projectDescription.trim();
    client.star = star.trim();

    // Handle photo upload (if provided)
    if (photo) {
      if (photo.size > 1000000) {
        return res.status(400).json({
          success: false,
          message: "Image size should be less than 1MB",
        });
      }
      client.photo = {
        data: fs.readFileSync(photo.path),
        contentType: photo.type,
      };
    }

    // Save updated client
    await client.save();

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    console.error("Error updating client:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating",
      error: error.message,
    });
  }
};

export const deleteClientController = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByIdAndDelete(id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Client Deleted Successfully",
      client,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Error while deleteing client",
      error: error.message,
    });
  }
};
