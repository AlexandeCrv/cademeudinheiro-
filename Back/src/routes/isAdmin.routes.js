// routes/admin.js
import express from "express";
import { getAdminOverview } from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";

import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/overview", protect, isAdmin, getAdminOverview);

export default router;
