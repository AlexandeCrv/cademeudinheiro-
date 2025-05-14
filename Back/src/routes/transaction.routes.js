import { protect } from "../middlewares/authMiddleware.js";
import express from "express";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  getTransactionSummary,
  getTransactionSummaryByPeriod,
} from "../controllers/transactionController.js";

const router = express.Router();
router.use(protect);
router.post("/", createTransaction);

router.put("/:id", updateTransaction);

router.get("/", getTransactions);
router.delete("/:id", deleteTransaction);
router.get("/summary", getTransactionSummary);
router.get("/summary/:ano/:mes", getTransactionSummaryByPeriod);

export default router;
