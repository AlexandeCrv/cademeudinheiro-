import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: mongoose.Schema.Types.Decimal128, required: true },
  type: { type: String, enum: ["entrada", "saida"], required: true },
  category: { type: String, required: true }, // <-- NOVO CAMPO
  observacao: { type: String, required: false }, // <-- NOVO CAMPO
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export const Transaction = mongoose.model("Transaction", TransactionSchema);
