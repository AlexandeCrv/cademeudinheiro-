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
