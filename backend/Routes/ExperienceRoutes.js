import Express from "express";
import {
  createExperience,
  DeleteExperience,
  GetExperience,
  updateExperience,
} from "../controller/ExperienceController.js";

const router = Express.Router();

router.post("/create-experience", createExperience);

router.post("/update-experience/:id", updateExperience);

router.get("/getAll-experience", GetExperience);

router.delete("/delete-experience/:id", DeleteExperience);

export default router;
