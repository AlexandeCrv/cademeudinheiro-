import { User } from "../models/User.js";
import { Transaction } from "../models/Transaction.js";
import { Goal } from "../models/Goal.js";

export const getAdminOverview = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select(
      "name email role isOnline isBlocked"
    );

    const totalUsers = users.length;
    const onlineUsers = users.filter((u) => u.isOnline).length;

    const totalTransactions = await Transaction.countDocuments();
    const totalGoals = await Goal.countDocuments();

    res.json({
      totalUsers,
      onlineUsers,
      totalTransactions,
      totalGoals,
      recentUsers: users.slice(-5),
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar dados administrativos" });
  }
};
export const createAdmin = async (req, res) => {
  const { name, email, password, secret } = req.body;

  // Verifica se o segredo bate com o que está no .env para proteger esse endpoint
  if (secret !== process.env.CREATE_ADMIN_SECRET) {
    return res.status(403).json({ message: "Acesso negado" });
  }

  try {
    // Verifica se já existe usuário com esse email
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Usuário já existe" });

    // Cria hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário admin
    const adminUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin", // define o role admin
    });

    await adminUser.save();

    res.status(201).json({ message: "Admin criado com sucesso", adminUser });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar admin", error });
  }
};
