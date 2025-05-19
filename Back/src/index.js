import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDatabase } from "./database/database.js";

import transactionRoutes from "./routes/transaction.routes.js";
import authRoutes from "./routes/auth.routes.js";
import goalRoutes from "./routes/goal.routes.js";
import financeRoutes from "./routes/finance.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import aiRoutes from "./routes/ai.routes.js";

import adminRoutes from "./routes/isAdmin.routes.js";

import { protect } from "./middlewares/authMiddleware.js";
import { isAdmin } from "./middlewares/isAdmin.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Usando as rotas
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/goals", goalRoutes);
app.use("/profile", profileRoutes);
app.use("/ai", aiRoutes);
app.use("/admin", adminRoutes);
app.use("/api", financeRoutes);
app.get("/", (req, res) => {
  res.send("API FinanControl rodando 🚀");
});
app.get("/admin", protect, isAdmin, (req, res) => {
  res.json({ message: "Bem-vindo, admin!" });
});
app.get("/online-users", protect, isAdmin, (req, res) => {
  res.json({ onlineUsers: [] });
});

// Conecta ao banco e inicia servidor
connectDatabase().then(() => {
  app.listen(3001, () => {
    console.log("✅ Servidor rodando em http://localhost:3001 espero");
  });
});
