import express from "express";
import { protect } from "../middlewares/authMiddleware.js"; // Middleware de proteção
import {
  getFinanceSummary, // Função de resumo financeiro
} from "../controllers/financeController.js"; // Controller que irá tratar as requisições

const router = express.Router();

// Usando o middleware de proteção para garantir que o usuário esteja autenticado
router.use(protect);

// Definindo a rota para obter o resumo financeiro
router.get("/finances", getFinanceSummary);

export default router;
