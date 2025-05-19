// hooks/useMetas.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useMetas() {
  const router = useRouter();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [userName, setUserName] = useState("");
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayAmount, setDisplayAmount] = useState("");
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchUserData(token);
    fetchGoals(token);
  }, []);

  const fetchUserData = async (token) => {
    try {
      const userRes = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      setUserName(userData.name || "Usuário");
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
    }
  };
  const fetchGoals = async (token) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao buscar metas");

      const data = await res.json();
      const categoryColors = [
        "rgba(46, 204, 113, 0.8)",
        "rgba(255, 206, 86, 0.8)",
        "rgba(255, 99, 132, 0.8)",
        "rgba(153, 102, 255, 0.8)",
        "rgba(54, 162, 235, 0.8)",
      ];

      const formattedGoals = data.map((goal, index) => ({
        id: goal._id,
        title: goal.title,
        targetAmount: goal.amount,
        currentAmount: goal.current || 0,
        deadline: new Date(goal.deadline).toISOString().split("T")[0],
        createdAt: new Date(goal.createdAt).toISOString().split("T")[0],
        color: categoryColors[index % categoryColors.length],
        completed: goal.current >= goal.amount,
      }));

      setGoals(formattedGoals);
    } catch (err) {
      console.error("Erro ao buscar metas:", err);
      setError("Não foi possível carregar suas metas.");
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    const numeric = Number(raw) / 100;
    setTargetAmount(numeric);
    setDisplayAmount(formatCurrency(numeric));
  };

  const resetForm = () => {
    setTitle("");
    setTargetAmount("");
    setDeadline("");
    setIsSubmitting(false);
    setEditingGoal(null);
  };

  const openModal = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
      setTitle(goal.title);
      setTargetAmount(goal.targetAmount.toString());
      setDeadline(goal.deadline);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const url = editingGoal
        ? `${BASE_URL}/goals/${editingGoal.id}`
        : `${BASE_URL}/goals`;

      const method = editingGoal ? "PUT" : "POST";

      const body = editingGoal
        ? {
            title,
            amount: Number(targetAmount),
            current: editingGoal.currentAmount,
            deadline,
          }
        : {
            title,
            amount: Number(targetAmount),
            deadline,
          };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Erro ao salvar meta");

      await fetchGoals(token);
      closeModal();
    } catch (err) {
      console.error("Erro ao salvar meta:", err);
      setError("Não foi possível salvar a meta.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const deleteGoal = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BASE_URL}/goals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao deletar meta");
      await fetchGoals(token);
    } catch (err) {
      console.error("Erro ao deletar meta:", err);
      setError("Não foi possível deletar a meta.");
    }
  };
  const updateGoalProgress = async (id, amount) => {
    const token = localStorage.getItem("token");
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;

    const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
    const completed = newAmount >= goal.targetAmount;

    try {
      const res = await fetch(`${BASE_URL}/goals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ current: newAmount }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar progresso");

      if (completed && !goal.completed) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }

      await fetchGoals(token);
    } catch (err) {
      console.error("Erro ao atualizar progresso:", err);
      setError("Erro ao atualizar progresso");
    }
  };
  const calculateDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getProgressColor = (goal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const daysRemaining = calculateDaysRemaining(goal.deadline);

    if (goal.completed) return "bg-green-500";
    if (daysRemaining < 0) return "bg-red-500";
    if (progress < 25) return "bg-red-400";
    if (progress < 50) return "bg-yellow-400";
    if (progress < 75) return "bg-blue-400";
    return "bg-green-400";
  };

  const formatCurrency = (value) => {
    if (!value) return "R$ 0,00";
    if (typeof value === "object" && value.$numberDecimal) {
      value = Number.parseFloat(value.$numberDecimal);
    }

    const parsed = typeof value === "number" ? value : parseFloat(value);
    if (isNaN(parsed)) return "R$ 0,00";

    return parsed.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return {
    userName,
    goals,
    loading,
    error,
    title,
    targetAmount,
    deadline,
    displayAmount,
    isModalOpen,
    isSubmitting,
    showCelebration,
    editingGoal,
    openModal,
    closeModal,
    handleSubmit,
    deleteGoal,
    updateGoalProgress,
    handleCurrencyChange,
    calculateDaysRemaining,
    getProgressColor,
    formatCurrency,
    setTitle,
    setTargetAmount,
    setDeadline,
    handleLogout,
  };
}
