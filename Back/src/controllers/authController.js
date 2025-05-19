import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email já cadastrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser._id);
    res.status(201).json({
      user: {
        id: newUser._id,
        name,
        email,
        profilePhoto: newUser.profilePhoto,
        gender: newUser.gender,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Erro ao registrar usuário" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuário não encontrado" });
    if (user.isBlocked) {
      return res
        .status(403)
        .json({ message: "Conta bloqueada. Contate o administrador." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Senha incorreta" });
    user.isOnline = true;
    await user.save();

    const token = generateToken(user._id);
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email,
        profilePhoto: user.profilePhoto,
        gender: user.gender,
        birthDate: user.birthDate,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Erro ao fazer login" });
    console.error(err);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select(
      "name email profilePhoto gender bio phone birthDate"
    );
    if (!currentUser) return res.status(404).json({ message: "Usuário não encontrado" });

    const users = await User.find({})
      .select("name email isOnline createdAt")
      .sort({ isOnline: -1, createdAt: 1 });

    res.json({
      currentUser: {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        profilePhoto: currentUser.profilePhoto,
        gender: currentUser.gender,
        bio: currentUser.bio,
        phone: currentUser.phone,
      },
      users,
    });
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar dados" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    user.isOnline = false;
    await user.save();

    res.status(200).json({ message: "Logout feito com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao fazer logout" });
  }
};
export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() === userId) {
      return res
        .status(400)
        .json({ message: "Você não pode bloquear sua própria conta." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    user.isBlocked = true;
    await user.save();
    res.json({
      message: `Usuário ${user.name} bloqueado com sucesso.`,
      user, // <- isso é o objeto com isBlocked: true
    });
  } catch (err) {
    res.status(500).json({ message: "Erro ao bloquear usuário" });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    user.isBlocked = false;
    await user.save();
    res.json({
      message: `Usuário ${user.name} desbloqueado com sucesso.`,
      user, // <- agora com isBlocked: false
    });
  } catch (err) {
    res.status(500).json({ message: "Erro ao desbloquear usuário" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() === userId) {
      return res
        .status(400)
        .json({ message: "Você não pode deletar sua própria conta." });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    res.json({ message: `Usuário ${user.name} deletado com sucesso.` });
  } catch (err) {
    res.status(500).json({ message: "Erro ao deletar usuário" });
  }
};
