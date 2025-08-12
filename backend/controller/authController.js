import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utils/authHelper.js";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import storage from "../utils/cloudinaryStorage.js";
// Assuming you have this utility function

export const registerController = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate input fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate email format (simple regex check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate password length
    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 4 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered. Please login.",
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const user = await userModel.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET, // Ensure your .env file has the correct variable
      { expiresIn: "7d" }
    );

    // Send success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error while registering user",
      error: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not registered",
      });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, role: user.role }, // Use `_id` to match MongoDB convention
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response with user data and token
    return res.status(200).json({
      success: true,
      message: "Login Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role, // Include role if available
      },
      token, // Include the generated token
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while logging in user",
      error: error.message || "Internal Server Error",
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // ✅ add random value in payload (just to make it unique)
    const resetTokenSalt = uuidv4();
    const payload = {
      _id: user._id,
      resetTokenSalt, // payload me pass karo
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `${process.env.CORS_ORIGIN}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Reset link sent successfully",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send reset link",
      error: error.message,
    });
  }
};
export const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    // ✅ Token verify – must match the one created during forgot-password
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use exact same secret
    console.log("Decoded Token:", decoded);

    // ✅ Get user from token
    const user = await userModel.findById(decoded._id);
    console.log("user name", user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Hash and update password
    user.password = await hashPassword(newPassword);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    return res.status(400).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Token expired. Please request a new one."
          : "Invalid or expired token",
    });
  }
};

// controller/updateMe.js
export const getUserDetailsById = async (req, res) => {
  try {
    const userId = req.params.id; // 👈 Use `params`, not `query`
    console.log("User ID:", userId);

    const user = await userModel.findById(userId); // or however you're fetching
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    console.error("Error in getUserDetailsById:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const userController = async (req, res) => {
  try {
    const { userId, name } = req.body;
    const file = req.file; // Multer already uploaded to Cloudinary

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) user.name = name;

    if (file) {
      // Cloudinary URL from multer-storage-cloudinary
      user.image = file.path;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};
