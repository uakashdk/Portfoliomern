import express from "express";
import {
  loginController,
  registerController,
  forgotPasswordController,
  resetPasswordController,
  userController,
  getUserDetailsById,
} from "../controller/authController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js";
const router = express.Router();

router.post("/register", registerController);

router.post("/user-update", upload.single("image"), userController);

router.get("/users/:id", getUserDetailsById);

router.post("/login", loginController);

router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

// User-Auth
// User authentication route
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true }); // Respond with ok: true if authenticated
});
// Admin Routes

router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
