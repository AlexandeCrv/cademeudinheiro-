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

    const newUser = new User({ name, email, password });
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Senha incorreta" });

    const token = generateToken(user._id);
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email,
        profilePhoto: user.profilePhoto,
        gender: user.gender,
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
    const user = await User.findById(req.user._id).select(
      "name email profilePhoto gender bio phone"
    );
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto,
      gender: user.gender,
      bio: user.bio,
      phone: user.phone,
    });
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar usuário" });
  }
};
