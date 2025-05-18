import express from "express";
import { blockUser, unblockUser, deleteUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
// Seu middleware que verifica o token e popula req.user
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.put("/users/:userId/block", protect, isAdmin, blockUser);
router.put("/users/:userId/unblock", protect, isAdmin, unblockUser);
router.delete("/users/:userId", protect, isAdmin, deleteUser);

export default router;
