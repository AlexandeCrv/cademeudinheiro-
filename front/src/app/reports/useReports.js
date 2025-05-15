"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useInsightGenerator from "./insight-generator";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  Download,
  PieChart,
  LineChart,
  Lightbulb,
} from "lucide-react";
import { jsPDF } from "jspdf";
export default function ReportsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("insights");
  const [timeframe, setTimeframe] = useState("month");
  const [expandedInsight, setExpandedInsight] = useState(null);
  const [userName, setUserName] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Use the enhanced insight generator
  const { insights, recommendations } = useInsightGenerator(transactions, summary);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData();
  }, [timeframe]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch transactions, profile, and summary data
      const [transactionsRes, profileRes, summaryRes] = await Promise.all([
        fetch(`http://localhost:3001/transactions?timeframe=${timeframe}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:3001/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:3001/transactions/summary", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const transData = await transactionsRes.json();
      const profileData = await profileRes.json();
      const summaryData = await summaryRes.json();

      setTransactions(transData);
      setUserName(profileData.name || "Usuário");
      setSummary(summaryData);

      // Process data for charts
      processChartData(transData);
      generateForecastData();
    } catch (err) {
      setError("Erro ao carregar dados.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (transactions) => {
    // Process category data for pie chart
    const categoryMap = {};
    const monthlyMap = {};

    transactions.forEach((transaction) => {
      // Process all transactions for monthly data
      const amount =
        typeof transaction.amount === "object" && transaction.amount.$numberDecimal
          ? Number.parseFloat(transaction.amount.$numberDecimal)
          : Number.parseFloat(transaction.amount) || 0;

      // Process monthly data
      const date = new Date(transaction.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!monthlyMap[monthYear]) {
        monthlyMap[monthYear] = { income: 0, expense: 0, savings: 0 };
      }

      if (transaction.type === "entrada") {
        monthlyMap[monthYear].income += amount;
      } else if (transaction.type === "saida") {
        monthlyMap[monthYear].expense += amount;

        // Process category data for expenses
        const category = transaction.category || "outros_saida";
        categoryMap[category] = (categoryMap[category] || 0) + amount;
      }

      // Calculate savings
      monthlyMap[monthYear].savings =
        monthlyMap[monthYear].income - monthlyMap[monthYear].expense;
    });

    // Convert category map to array for chart
    const categoryChartData = Object.entries(categoryMap).map(([category, value]) => {
      const label = getCategoryName(category);

      return {
        category: label,
        categoryKey: category,
        value: value,
      };
    });

    // Convert monthly map to array for chart
    const monthlyChartData = Object.entries(monthlyMap)
      .sort((a, b) => {
        const [monthA, yearA] = a[0].split("/");
        const [monthB, yearB] = b[0].split("/");
        return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
      })
      .map(([monthYear, data]) => {
        return {
          month: monthYear,
          income: data.income,
          expense: data.expense,
          balance: data.income - data.expense,
          savings: data.savings > 0 ? data.savings : 0,
        };
      });

    setCategoryData(categoryChartData);
    setMonthlyData(monthlyChartData);
    setHistoricalData(monthlyChartData);
  };

  const generateForecastData = () => {
    // This would ideally come from an API with ML predictions
    // For now, we'll generate some sample forecast data

    // Get the last month from historical data or use current month
    const lastMonth =
      historicalData.length > 0
        ? historicalData[historicalData.length - 1]
        : { month: new Date().getMonth() + 1 + "/" + new Date().getFullYear() };

    const [month, year] = lastMonth.month.split("/").map(Number);

    // Generate 6 months of forecast data
    const forecast = [];
    for (let i = 1; i <= 6; i++) {
      const forecastMonth = month + i > 12 ? month + i - 12 : month + i;
      const forecastYear = month + i > 12 ? year + 1 : year;

      // Base values on the average of historical data with some randomness
      const avgIncome =
        historicalData.reduce((sum, item) => sum + item.income, 0) /
        Math.max(1, historicalData.length);
      const avgExpense =
        historicalData.reduce((sum, item) => sum + item.expense, 0) /
        Math.max(1, historicalData.length);

      // Add some trend and seasonality
      const seasonalFactor = forecastMonth >= 11 || forecastMonth <= 1 ? 1.2 : 1.0; // Higher in Nov-Jan
      const trendFactor = 1 + i * 0.02; // 2% growth per month

      const income = avgIncome * trendFactor * (0.95 + Math.random() * 0.1);
      const expense =
        avgExpense * seasonalFactor * trendFactor * (0.9 + Math.random() * 0.2);
      const savings = Math.max(0, income - expense);

      forecast.push({
        month: `${forecastMonth}/${forecastYear}`,
        income,
        expense,
        balance: income - expense,
        savings,
      });
    }

    setForecastData(forecast);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const formatCurrency = (value) => {
    if (!value) return "R$ 0,00";

    const parsedValue = typeof value === "number" ? value : Number.parseFloat(value);

    if (isNaN(parsedValue)) {
      return "R$ 0,00";
    }

    return parsedValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF();

    // Set up document
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // Add title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório Financeiro Personalizado", margin, yPos);
    yPos += 10;

    // Add date
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, margin, yPos);
    yPos += 20;

    // Add insights section
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Insights Financeiros", margin, yPos);
    yPos += 10;

    // Add insights
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    insights.forEach((insight) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text(insight.title, margin, yPos);
      yPos += 7;

      doc.setFont("helvetica", "normal");

      // Split long description into multiple lines
      const descLines = doc.splitTextToSize(insight.description, pageWidth - 2 * margin);
      doc.text(descLines, margin, yPos);
      yPos += 7 * descLines.length;

      // Add a little space between insights
      yPos += 5;
    });

    // Add recommendations section
    yPos += 10;

    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Recomendações", margin, yPos);
    yPos += 10;

    // Add recommendations
    doc.setFontSize(12);

    recommendations.forEach((recommendation) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text(
        `${recommendation.title} (Prioridade: ${recommendation.priority})`,
        margin,
        yPos
      );
      yPos += 7;

      doc.setFont("helvetica", "normal");

      // Split long description into multiple lines
      const descLines = doc.splitTextToSize(
        recommendation.description,
        pageWidth - 2 * margin
      );
      doc.text(descLines, margin, yPos);
      yPos += 7 * descLines.length;

      // Add action items
      yPos += 5;
      recommendation.actionItems.forEach((item, index) => {
        // Check if we need a new page
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        const itemLines = doc.splitTextToSize(`• ${item}`, pageWidth - 2 * margin - 5);
        doc.text(itemLines, margin + 5, yPos);
        yPos += 7 * itemLines.length;
      });

      // Add a little space between recommendations
      yPos += 10;
    });

    // Save the PDF
    doc.save("relatorio_financeiro.pdf");
  };

  const getCategoryName = (category) => {
    switch (category) {
      case "alimentacao":
        return "Alimentação";
      case "transporte":
        return "Transporte";
      case "lazer":
        return "Lazer";
      case "moradia":
        return "Moradia";
      case "saude":
        return "Saúde";
      case "educacao":
        return "Educação";
      case "emprestimos":
        return "Empréstimos";
      case "cartao_credito":
        return "Cartão de Crédito";
      case "outros_saida":
        return "Outros";
      default:
        return category;
    }
  };

  // Animation variants for page elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return {
    transactions,
    insights,
    recommendations,
    loading,
    error,
    activeTab,
    setActiveTab,
    timeframe,
    setTimeframe,
    itemVariants,
    containerVariants,
    expandedInsight,
    setExpandedInsight,
    userName,
    categoryData,
    monthlyData,
    handleLogout,
    formatCurrency,
    handleExportPDF,
    setTransactions,

    setLoading,
    setError,
    setActiveTab,
    setTimeframe,
    setExpandedInsight,
    setUserName,
    setCategoryData,
    setMonthlyData,
    processChartData,
    historicalData,
    setForecastData,
    forecastData,
    generateForecastData,
    getCategoryName,

    fetchData,
  };
}
