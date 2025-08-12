import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./Config/db.js";
import cors from "cors";
import morgan from "morgan";
import authRoute from "./Routes/authRoutes.js";
import blogRoute from "./Routes/blogRoutes.js";
import projectRoute from "./Routes/projectRoutes.js";
import clientRoute from "./Routes/clientRoutes.js";
import contactRoute from "./Routes/contactRoutes.js";
import readBlogRoute from "./Routes/readBlogRoutes.js";
import commentRoute from "./Routes/commentRoutes.js"; // Import comment routes
// import userRoute from "./Routes/userRoute.js";
import http from "http";
import { Server } from "socket.io";
import { commentSocket } from "./Schocket/socket.js";
import path from "path";
// import { fileURLToPath } from "url";

dotenv.config();

// Initialize Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*", // Allow all origins or specify the allowed origin
    credentials: true, // Allow cookies or other credentials to be included
  },
});

// Use commentSocket for handling Socket.IO events
commentSocket(io);

// Database connection
ConnectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

// Routes - Make sure the API routes are defined **before** serving static files
// app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/project", projectRoute);
app.use("/api/v1/client", clientRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/readBlog", readBlogRoute);
app.use("/api/v1/comments", commentRoute); // Add comments route

// Resolve __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Serve static files (React build)
// const buildPath = path.join(__dirname, "../frontend/build");
// console.log("Serving static files from:", buildPath); // Log to check the path
// app.use(express.static(buildPath));

// Fallback for React SPA (this should be last, so it only handles routes that are not API routes)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
// });

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
