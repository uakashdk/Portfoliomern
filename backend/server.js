import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./Config/db.js";
import cors from "cors";
import morgan from "morgan";
import authRoute from "./Routes/authRoutes.js";
import blogRoute from "./Routes/blogRoutes.js";
import ExperienceRoute from "./Routes/ExperienceRoutes.js";
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

// ---- CORS (one place, reused) ----
const allowedOrigins = [
  "https://akashkumardubey.in", // main live frontend
  "https://akashkumardubey.netlify.app", // Netlify project
  "http://localhost:3000", // local dev
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // needed if using cookies or JWT
};

app.use(cors(corsOptions));
// (optional but helpful for preflight)
app.options("*", cors(corsOptions));

// ---- Middleware ----
app.use(morgan("dev"));
app.use(express.json());

// ---- DB ----
ConnectDB();

// ---- Socket.IO ----
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});
commentSocket(io);

// ---- Routes ----
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/experience", ExperienceRoute);
app.use("/api/v1/project", projectRoute);
app.use("/api/v1/client", clientRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/readBlog", readBlogRoute);
app.use("/api/v1/comments", commentRoute);

// ---- Start ----
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
