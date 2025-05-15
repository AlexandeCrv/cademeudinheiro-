import express from "express";
import { getInsightFromAI } from "../controllers/aiController.js";
import { protect } from "../middlewares/authMiddleware.js"; // Protege a rota

const router = express.Router();

router.post("/insight", protect, getInsightFromAI); // Rota protegida

export default router;
