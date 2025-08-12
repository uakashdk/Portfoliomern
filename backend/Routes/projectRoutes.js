import express from "express";
import {
  createProjectController,
  deleteProjectController,
  getProjectController,
  updateProjectController,
} from "../controller/projectController.js";
import formidableMiddleware from "express-formidable";

const router = express.Router();

router.post("/create-project", formidableMiddleware(), createProjectController);

router.get("/projects", getProjectController);

router.put(
  "/update-project/:id",
  formidableMiddleware(),
  updateProjectController
);

router.delete(
  "/delete-project/:id",
  formidableMiddleware(),
  deleteProjectController
);

export default router;
