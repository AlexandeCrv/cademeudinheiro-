import { useEffect } from "react";

export function useChartData(transactions, setChartData) {
  useEffect(() => {
    if (!transactions.length) return;

    const groupedByDate = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.createdAt).toLocaleDateString("pt-BR");

      if (!acc[date]) acc[date] = { entrada: 0, saida: 0 };

      const amount =
        typeof transaction.amount === "object" && transaction.amount.$numberDecimal
          ? parseFloat(transaction.amount.$numberDecimal)
          : parseFloat(transaction.amount);

      if (transaction.type === "entrada") acc[date].entrada += amount;
      else acc[date].saida += amount;

      return acc;
    }, {});

    const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
      const dateA = new Date(a.split("/").reverse().join("-"));
      const dateB = new Date(b.split("/").reverse().join("-"));
      return dateA.getTime() - dateB.getTime();
    });

    const labels = sortedDates;
    const entradas = sortedDates.map((date) => groupedByDate[date].entrada);
    const saidas = sortedDates.map((date) => groupedByDate[date].saida);

    setChartData({
      labels,
      datasets: [
        {
          label: "Entradas",
          data: entradas,
          borderColor: "rgba(52, 211, 153, 1)",
          backgroundColor: "rgba(52, 211, 153, 0.2)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Saídas",
          data: saidas,
          borderColor: "rgba(248, 113, 113, 1)",
          backgroundColor: "rgba(248, 113, 113, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    });
  }, [transactions, setChartData]);
}
