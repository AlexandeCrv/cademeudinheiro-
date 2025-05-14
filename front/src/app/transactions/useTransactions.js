import { useEffect, useState } from "react";

export function useTransactions(token, handleLogout) {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Entradas",
        data: [],
        borderColor: "rgba(52, 211, 153, 1)",
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Saídas",
        data: [],
        borderColor: "rgba(248, 113, 113, 1)",
        backgroundColor: "rgba(248, 113, 113, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [transactionsRes, userRes] = await Promise.all([
        fetch("http://localhost:3001/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:3001/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const transData = await transactionsRes.json();
      const userData = await userRes.json();

      setTransactions(transData);
      setFilteredTransactions(transData);
      setUserName(userData.name || "Usuário");
    } catch (err) {
      setError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    const numericValue =
      typeof value === "object" && value?.$numberDecimal
        ? parseFloat(value.$numberDecimal)
        : parseFloat(value);

    return numericValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", options);
  };
  // Função formatTime
  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const hours = String(time.getHours()).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    const seconds = String(time.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  const handleDelete = async (transactionId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/transactions/${transactionId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setTransactions(
          transactions.filter((transaction) => transaction._id !== transactionId)
        );
        setFilteredTransactions(
          filteredTransactions.filter((transaction) => transaction._id !== transactionId)
        );
      } else {
        setError("Erro ao deletar transação.");
      }
    } catch (err) {
      setError("Erro ao deletar transação.");
    }
  };
  useEffect(() => {
    fetchData();
  }, [token]); // Adicionei `token` na dependência do useEffect

  return {
    transactions,
    setTransactions,
    filteredTransactions,
    setFilteredTransactions,
    handleDelete,
    chartData,
    setChartData,
    formatDate,
    loading,
    formatTime,
    error,
    userName,
    fetchData,
    formatCurrency,
  };
}
