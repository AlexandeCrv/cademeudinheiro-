import express from "express";
import {
  registerUser,
  logoutUser,
  loginUser,
  getUserProfile,
  blockUser,
  unblockUser,
  deleteUser,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { createAdmin } from "../controllers/adminController.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUserProfile);
router.post("/logout", protect, logoutUser);

// ✅ NOVAS ROTAS DE ADMIN
router.put("/users/:userId/block", protect, isAdmin, blockUser);
router.put("/users/:userId/unblock", protect, isAdmin, unblockUser);
router.delete("/users/:userId", protect, isAdmin, deleteUser);
router.post("/create-admin-temp", createAdmin);

export default router;
