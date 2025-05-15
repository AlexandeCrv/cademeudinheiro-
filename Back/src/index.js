// index.js
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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Usando as rotas
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/goals", goalRoutes);
app.use("/profile", profileRoutes);
app.use("/ai", aiRoutes);
app.get("/", (req, res) => {
  res.send("API FinanControl rodando 🚀");
});
app.use("/api", financeRoutes);

connectDatabase().then(() => {
  app.listen(3001, () => {
    console.log("✅ Servidor rodando em http://localhost:3001");
  });
});
