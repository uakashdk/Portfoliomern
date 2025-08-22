import express from "express";
import {
  createClientController,
  deleteClientController,
  getClientController,
  updateClientController,
} from "../controller/clientController.js";
import formidableMiddleware from "express-formidable";

const router = express.Router();

router.post("/create-client", formidableMiddleware(), createClientController);

router.get("/client", getClientController);

router.put(
  "/update-client/:id",
  formidableMiddleware(),
  updateClientController
);

router.delete(
  "/delete-client/:id",
  formidableMiddleware(),
  deleteClientController
);

export default router;
