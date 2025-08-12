import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Middleware for token-based protected routes
export const requireSignIn = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header is provided and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Verify the token using the secret key from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token in requireSignIn:", decoded); // Debugging log

    req.user = decoded; // Attach decoded payload to request object

    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

// Middleware to check if the user is an admin
export const isAdmin = async (req, res, next) => {
  try {
    // Check if user is logged in
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access, please sign in",
      });
    }

    // Find the user by their ID (from the token) and select the role
    const user = await userModel.findById(req.user._id).select("role");

    console.log("Admin Check - User:", user); // Debugging log
    console.log("Admin Check - User Role:", user?.role); // Debugging log

    // Check if the user has an admin role (assuming role=1 is for admins)
    if (!user || user.role !== 1) {
      return res.status(403).json({
        success: false,
        message: "Access denied, admin privileges required",
      });
    }

    next(); // Proceed if the user is an admin
  } catch (error) {
    console.error("Admin authorization error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during admin authorization",
      error: error.message,
    });
  }
};
