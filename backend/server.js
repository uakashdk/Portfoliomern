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
import commentRoute from "./Routes/commentRoutes.js";
import http from "http";
import { Server } from "socket.io";
import { commentSocket } from "./Schocket/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Common CORS config for both Express and Socket.IO
const cors = require("cors");

app.use(
  cors({
    origin: ["https://akashkumardubey.netlify.app", "http://localhost:3000"],
    credentials: true,
  })
);

// Apply middleware
app.use(morgan("dev"));
app.use(express.json());

// Database connection
ConnectDB();

// ✅ Socket.IO init
const io = new Server(server, {
  cors: corsOptions,
});

// Socket.IO events
commentSocket(io);

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/project", projectRoute);
app.use("/api/v1/client", clientRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/readBlog", readBlogRoute);
app.use("/api/v1/comments", commentRoute);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
