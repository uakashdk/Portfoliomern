import express from "express";
import { submitContactForm } from "../controller/contactController.js"; // Fix: Use named import

const router = express.Router();

router.post("/create-contact", submitContactForm);

export default router;
