import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
export default function useCategories() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("month");
  const [categoryType, setCategoryType] = useState("all");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [userName, setUserName] = useState("");
  const [transactions, setTransactions] = useState([]);

  // Cores para as categorias
  const categoryColors = [
    "rgba(138, 43, 226, 0.8)", // Roxo
    "rgba(75, 192, 192, 0.8)", // Turquesa
    "rgba(255, 99, 132, 0.8)", // Rosa
    "rgba(54, 162, 235, 0.8)", // Azul
    "rgba(255, 206, 86, 0.8)", // Amarelo
    "rgba(255, 159, 64, 0.8)", // Laranja
    "rgba(153, 102, 255, 0.8)", // Roxo claro
    "rgba(255, 99, 71, 0.8)", // Tomate
    "rgba(46, 204, 113, 0.8)", // Verde
    "rgba(41, 128, 185, 0.8)", // Azul escuro
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchUserData(token);
    fetchTransactions(token);
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      processCategoryData();
    }
  }, [transactions, period, categoryType]);

  const fetchUserData = async (token) => {
    try {
      const userRes = await fetch("http://localhost:3001/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      setUserName(userData.name || "Usuário");
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
    }
  };

  const fetchTransactions = async (token) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao buscar transações");

      const data = await res.json();
      console.log("Transações carregadas:", data); // Debug
      setTransactions(data);
    } catch (err) {
      console.error("Erro ao buscar transações:", err);
      setError("Não foi possível carregar as transações.");
    } finally {
      setLoading(false);
    }
  };

  const processCategoryData = () => {
    let filteredTransactions = [...transactions];
    console.log("Processando categorias com", filteredTransactions.length, "transações"); // Debug

    if (period !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filteredTransactions = filteredTransactions.filter((t) => {
        const transDate = new Date(t.createdAt);

        if (period === "month") {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return transDate >= monthAgo;
        } else if (period === "quarter") {
          const quarterAgo = new Date(today);
          quarterAgo.setMonth(quarterAgo.getMonth() - 3);
          return transDate >= quarterAgo;
        } else if (period === "year") {
          const yearAgo = new Date(today);
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          return transDate >= yearAgo;
        }
        return true;
      });
    }

    if (categoryType !== "all") {
      filteredTransactions = filteredTransactions.filter((t) => t.type === categoryType);
    }

    console.log("Transações filtradas:", filteredTransactions); // Debug

    const categoryGroups = {};

    filteredTransactions.forEach((transaction) => {
      const category = transaction.category || "outros";

      let amount = 0;

      if (typeof transaction.amount === "string") {
        amount = Number.parseFloat(transaction.amount.replace(/[^\d.-]/g, ""));
      } else if (typeof transaction.amount === "number") {
        amount = transaction.amount;
      } else if (transaction.amount && transaction.amount.$numberDecimal) {
        amount = Number.parseFloat(transaction.amount.$numberDecimal);
      }

      console.log(`Transação ${transaction._id}: categoria=${category}, valor=${amount}`); // Debug

      if (!categoryGroups[category]) {
        categoryGroups[category] = {
          id: category,
          name: getCategoryName(category),
          amount: 0,
          count: 0,
        };
      }

      categoryGroups[category].amount += amount || 0;
      categoryGroups[category].count += 1;
    });

    console.log("Grupos de categorias:", categoryGroups);

    const total = Object.values(categoryGroups).reduce((sum, cat) => sum + cat.amount, 0);

    const categoryArray = Object.values(categoryGroups).map((cat, index) => ({
      ...cat,
      percentage: total > 0 ? (cat.amount / total) * 100 : 0,
      color: categoryColors[index % categoryColors.length],
    }));

    categoryArray.sort((a, b) => b.amount - a.amount);

    console.log("Array de categorias processado:", categoryArray);
    console.log("Total:", total);

    setCategoryData(categoryArray);
    setTotalAmount(total);
  };

  const getCategoryName = (categoryId) => {
    const categoryMap = {
      salario: "Salário",
      investimentos: "Investimentos",
      emprestimos: "Empréstimos",
      presente: "Presente",
      bonus: "Bônus",
      outros_entrada: "Outros (Entrada)",

      // Saídas
      moradia: "Moradia",
      alimentacao: "Alimentação",
      transporte: "Transporte",
      saude: "Saúde",
      educacao: "Educação",
      mercado: "Mercado",
      lazer: "Lazer",
      cartao: "Cartão de Crédito",
      outros_saida: "Outros (Saída)",

      // Fallback
      outros: "Não categorizado",
    };

    return categoryMap[categoryId] || categoryId;
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "R$ 0,00";

    if (typeof value === "object" && value.$numberDecimal) {
      value = Number.parseFloat(value.$numberDecimal);
    }

    // Se for string, tenta converter para número
    if (typeof value === "string") {
      value = Number.parseFloat(value.replace(/[^\d.-]/g, ""));
    }

    const parsedValue = typeof value === "number" ? value : Number.parseFloat(value);

    if (isNaN(parsedValue)) {
      return "R$ 0,00";
    }

    return parsedValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Preparar dados para o gráfico de pizza
  const pieChartData = {
    labels: categoryData.map((cat) => cat.name),
    datasets: [
      {
        data: categoryData.map((cat) => cat.amount),
        backgroundColor: categoryData.map((cat) => cat.color),
        borderColor: categoryData.map((cat) => cat.color.replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  };

  // Preparar dados para o gráfico de barras
  const barChartData = {
    labels: categoryData.map((cat) => cat.name),
    datasets: [
      {
        label: "Valor Total",
        data: categoryData.map((cat) => cat.amount),
        backgroundColor: categoryData.map((cat) => cat.color),
        borderColor: categoryData.map((cat) => cat.color.replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  };

  // Opções para o gráfico de barras
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => formatCurrency(context.raw),
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
          font: { size: 14 },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "white",
          font: { size: 14 },
          callback: (value) => formatCurrency(value),
        },
      },
    },
  };

  // Opções para o gráfico de pizza
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "white",
          font: { size: 14 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = formatCurrency(context.raw);
            const percentage = Math.round((context.raw / totalAmount) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  return {
    loading,
    error,
    period,
    setPeriod,
    categoryType,
    setCategoryType,
    showPeriodDropdown,
    setShowPeriodDropdown,
    categoryData,
    totalAmount,
    userName,
    transactions,
    formatCurrency,
    pieChartData,
    pieChartOptions,
    barChartData,
    barChartOptions,
    handleLogout,
  };
}
