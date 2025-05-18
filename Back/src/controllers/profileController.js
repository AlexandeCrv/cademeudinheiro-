import { User } from "../models/User.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const updateProfile = async (req, res) => {
  try {
    const { name, gender, bio, phone } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (name) user.name = name;
    if (gender) user.gender = gender;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto,
      gender: user.gender,
      bio: user.bio,
      phone: user.phone,
    });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    res.status(500).json({ message: "Erro ao atualizar perfil" });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Nenhuma imagem enviada" });
    }

    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    if (user.profilePhoto) {
      const oldPhotoPath = path.join(__dirname, "..", user.profilePhoto);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    const relativePath = `/uploads/${req.file.filename}`;
    user.profilePhoto = relativePath;
    await user.save();

    res.status(200).json({
      id: user._id,
      profilePhoto: user.profilePhoto,
    });
  } catch (err) {
    console.error("Erro ao fazer upload da foto:", err);
    res.status(500).json({ message: "Erro ao fazer upload da foto" });
  }
};

export const getFullProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto,
      gender: user.gender,
      bio: user.bio,
      phone: user.phone,
      role: user.role,
    });
  } catch (err) {
    console.error("Erro ao buscar perfil:", err);
    res.status(500).json({ message: "Erro ao buscar perfil" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Acesso negado: apenas administradores podem ver todos os usuários.",
      });
    }

    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Erro ao buscar todos os usuários:", err);
    res.status(500).json({ message: "Erro ao buscar todos os usuários" });
  }
};
