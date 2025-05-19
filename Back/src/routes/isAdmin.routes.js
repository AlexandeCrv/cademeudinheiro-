// routes/isAdmin.routes.js
import express from "express";
import { getAdminOverview } from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { createAdmin } from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/overview", protect, isAdmin, getAdminOverview);
router.post("/create-admin-temp", createAdmin);
export default router;
