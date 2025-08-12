import express from "express";
import {
  addReadBlogController,
  getReadBlogbyUser,
} from "../controller/readBlogController.js";

const router = express.Router();

router.post("/add", addReadBlogController);

router.get("/user", getReadBlogbyUser);

export default router;
