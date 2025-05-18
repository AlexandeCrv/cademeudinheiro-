// scripts/updateUsers.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function updateUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado ao MongoDB ✅");

    // Atualiza todos para role: "user" e isOnline: false
    await User.updateMany({}, { role: "user", isOnline: false });

    // Atualiza especificamente sua conta para admin
    const result = await User.findOneAndUpdate(
      { email: "alexandecarvalho318@gmail.com" },
      { role: "admin" },
      { new: true }
    );

    if (result) {
      console.log(`Usuário admin atualizado com sucesso: ${result.email} 🛠`);
    } else {
      console.log("Usuário com esse e-mail não foi encontrado ❌");
    }

    mongoose.disconnect();
    console.log("Script finalizado e desconectado do MongoDB 🧹");
  } catch (error) {
    console.error("Erro ao atualizar usuários:", error.message);
    mongoose.disconnect();
  }
}

updateUsers();
