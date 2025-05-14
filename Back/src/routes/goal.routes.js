import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController.js"; // Importa as funções do controller

const router = express.Router();

// Rotas de metas com o middleware de proteção
router.get("/", protect, getGoals); // A rota para listar as metas precisa de autenticação
router.post("/", protect, createGoal); // A rota para criar uma nova meta precisa de autenticação
router.put("/:id", protect, updateGoal); // A rota para atualizar uma meta precisa de autenticação
router.delete("/:id", protect, deleteGoal); // A rota para deletar uma meta precisa de autenticação

export default router;
