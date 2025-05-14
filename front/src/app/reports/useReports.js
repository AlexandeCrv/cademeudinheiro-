"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("insights");
  const [timeframe, setTimeframe] = useState("month");
  const [expandedInsight, setExpandedInsight] = useState(null);
  const [userName, setUserName] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

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
      console.log(summaryData);
      setTransactions(transData);
      setUserName(profileData.name || "Usuário");

      // Process data for insights and recommendations
      generateInsights(transData, summaryData);
      generateRecommendations(transData, summaryData);
      processChartData(transData);
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
      if (transaction.type === "saida") {
        // Process category data
        const category = transaction.category || "outros_saida";
        const amount =
          typeof transaction.amount === "object" && transaction.amount.$numberDecimal
            ? Number.parseFloat(transaction.amount.$numberDecimal)
            : Number.parseFloat(transaction.amount) || 0;

        categoryMap[category] = (categoryMap[category] || 0) + amount;

        // Process monthly data
        const date = new Date(transaction.createdAt);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

        if (!monthlyMap[monthYear]) {
          monthlyMap[monthYear] = { income: 0, expense: 0 };
        }

        if (transaction.type === "entrada") {
          monthlyMap[monthYear].income += amount;
        } else {
          monthlyMap[monthYear].expense += amount;
        }
      }
    });

    // Convert category map to array for chart
    const categoryChartData = Object.entries(categoryMap).map(([category, value]) => {
      let label = category;

      // Map category codes to readable names
      switch (category) {
        case "alimentacao":
          label = "Alimentação";
          break;
        case "transporte":
          label = "Transporte";
          break;
        case "lazer":
          label = "Lazer";
          break;
        case "moradia":
          label = "Moradia";
          break;
        case "saude":
          label = "Saúde";
          break;
        case "educacao":
          label = "Educação";
          break;
        case "emprestimos":
          label = "Empréstimos";
          break;
        case "outros_saida":
          label = "Outros";
          break;
        default:
          label = category;
      }

      return {
        category: label,
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
        };
      });

    setCategoryData(categoryChartData);
    setMonthlyData(monthlyChartData);
  };

  const generateInsights = (transactions, summary) => {
    const insights = [];

    const totalIncome = summary.entradas || 0;
    const totalExpenses = summary.saidas || 0;
    const balance = totalIncome - totalExpenses;
    console.log(totalIncome, totalExpenses, balance);

    const expensesByCategory = {};
    const incomesByCategory = {};

    transactions.forEach((transaction) => {
      const amount =
        typeof transaction.amount === "object" && transaction.amount.$numberDecimal
          ? Number.parseFloat(transaction.amount.$numberDecimal)
          : Number.parseFloat(transaction.amount);

      if (transaction.type === "saida") {
        const category = transaction.category || "outros_saida";
        expensesByCategory[category] = (expensesByCategory[category] || 0) + amount;
      } else {
        const category = transaction.category || "outros_entrada";
        incomesByCategory[category] = (incomesByCategory[category] || 0) + amount;
      }
    });

    if (balance >= 0) {
      insights.push({
        id: "balance-positive",
        title: "Saldo Positivo",
        description: `Você tem um saldo positivo de ${formatCurrency(
          balance
        )} neste período.`,
        icon: TrendingUp,
        color: "green",
        details:
          "Manter um saldo positivo é essencial para a saúde financeira. Continue controlando seus gastos e economizando.",
      });
    } else {
      insights.push({
        id: "balance-negative",
        title: "Saldo Negativo",
        description: `Você tem um saldo negativo de ${formatCurrency(
          Math.abs(balance)
        )} neste período.`,
        icon: TrendingDown,
        color: "red",
        details:
          "Um saldo negativo indica que você está gastando mais do que ganha. Considere reduzir despesas não essenciais.",
      });
    }

    const totalExpensesValue = Object.values(expensesByCategory).reduce(
      (sum, value) => sum + value,
      0
    );

    Object.entries(expensesByCategory).forEach(([category, amount]) => {
      const percentage = (amount / totalExpensesValue) * 100;

      if (percentage > 30) {
        let categoryName = category;

        switch (category) {
          case "alimentacao":
            categoryName = "Alimentação";
            break;
          case "transporte":
            categoryName = "Transporte";
            break;
          case "lazer":
            categoryName = "Lazer";
            break;
          case "moradia":
            categoryName = "Moradia";
            break;
          case "saude":
            categoryName = "Saúde";
            break;
          case "educacao":
            categoryName = "Educação";
            break;
          case "emprestimos":
            categoryName = "Empréstimos";
            break;
          case "cartao_credito":
            categoryName = "Cartão de Crédito";
            break;
          case "outros_saida":
            categoryName = "Outros";
            break;
          default:
            categoryName = category;
        }

        insights.push({
          id: `high-spending-${category.toLowerCase()}`,
          title: `Alto Gasto em ${categoryName}`,
          description: `${percentage.toFixed(
            1
          )}% dos seus gastos são em ${categoryName} (${formatCurrency(amount)}).`,
          icon: AlertTriangle,
          color: "amber",
          details: `Você está gastando uma proporção significativa do seu orçamento em ${categoryName.toLowerCase()}. Considere analisar esses gastos para possíveis ajustes.`,
        });
      }
    });

    if (expensesByCategory["emprestimos"] > 0) {
      const loanAmount = expensesByCategory["emprestimos"];
      const loanPercentage = (loanAmount / totalExpensesValue) * 100;

      if (loanPercentage > 20) {
        insights.push({
          id: "high-loan-payments",
          title: "Pagamentos de Empréstimos Elevados",
          description: `${loanPercentage.toFixed(
            1
          )}% dos seus gastos são com empréstimos (${formatCurrency(loanAmount)}).`,
          icon: AlertTriangle,
          color: "red",
          details:
            "Uma alta proporção de pagamentos de empréstimos pode comprometer sua saúde financeira. Considere estratégias para reduzir suas dívidas mais rapidamente.",
        });
      }
    }

    if (balance > 0) {
      const savingsRate = (balance / totalIncome) * 100;

      if (savingsRate < 10) {
        insights.push({
          id: "low-savings-rate",
          title: "Taxa de Economia Baixa",
          description: `Você está economizando apenas ${savingsRate.toFixed(
            1
          )}% da sua renda.`,
          icon: Info,
          color: "amber",
          details:
            "Especialistas recomendam economizar pelo menos 20% da sua renda. Tente aumentar sua taxa de economia para uma reserva mais sólida.",
        });
      } else if (savingsRate >= 20) {
        insights.push({
          id: "good-savings-rate",
          title: "Boa Taxa de Economia",
          description: `Você está economizando ${savingsRate.toFixed(1)}% da sua renda.`,
          icon: TrendingUp,
          color: "green",
          details:
            "Parabéns! Sua taxa de economia é excelente e contribui para sua segurança financeira de longo prazo.",
        });
      }
    }

    // Novo insight: gastos fixos altos (moradia + transporte + educação + saúde)
    const fixedCategories = ["moradia", "transporte", "educacao", "saude"];
    const fixedTotal = fixedCategories.reduce(
      (sum, cat) => sum + (expensesByCategory[cat] || 0),
      0
    );
    const fixedPercentage = (fixedTotal / totalExpensesValue) * 100;

    if (fixedPercentage > 70) {
      insights.push({
        id: "high-fixed-expenses",
        title: "Gastos Fixos Muito Altos",
        description: `Seus gastos fixos representam ${fixedPercentage.toFixed(
          1
        )}% do total.`,
        icon: AlertTriangle,
        color: "red",
        details:
          "Quando os gastos fixos ultrapassam 70% das despesas, sobra pouco espaço para economias ou imprevistos. Reavalie seus compromissos mensais se possível.",
      });
    }

    // Novo insight: Diversificação de gastos
    const categoryCount = Object.keys(expensesByCategory).length;
    if (categoryCount <= 3 && totalExpenses > 0) {
      insights.push({
        id: "low-expense-diversity",
        title: "Pouca Diversificação de Gastos",
        description: `Seus gastos estão concentrados em poucas categorias (${categoryCount} principais).`,
        icon: Info,
        color: "amber",
        details:
          "Uma alta concentração de gastos em poucas áreas pode indicar riscos ou dependência de certos serviços. Avalie se há desequilíbrios.",
      });
    }

    setInsights(insights);
  };

  const generateRecommendations = (transactions, summary) => {
    const recommendations = [];

    const totalIncome = summary.totalEntradas || 0;
    const totalExpenses = summary.totalSaidas || 0;
    const balance = totalIncome - totalExpenses;

    const expensesByCategory = {};

    transactions.forEach((transaction) => {
      if (transaction.type === "saida") {
        const category = transaction.category || "outros_saida";
        const amount =
          typeof transaction.amount === "object" && transaction.amount.$numberDecimal
            ? Number.parseFloat(transaction.amount.$numberDecimal)
            : Number.parseFloat(transaction.amount);

        expensesByCategory[category] = (expensesByCategory[category] || 0) + amount;
      }
    });

    const totalExpensesValue = Object.values(expensesByCategory).reduce(
      (sum, value) => sum + value,
      0
    );

    if (balance < 0) {
      recommendations.push({
        id: "reduce-expenses",
        title: "Reduza Despesas Não Essenciais",
        description: "Seus gastos estão superando sua renda. Corte o que for supérfluo.",
        priority: "alta",
        actionItems: [
          "Identifique e corte gastos supérfluos",
          "Estabeleça um orçamento mensal rigoroso",
          "Busque alternativas mais econômicas para suas necessidades",
        ],
      });
    }

    if (expensesByCategory["emprestimos"]) {
      const loanAmount = expensesByCategory["emprestimos"];
      const loanPercentage = (loanAmount / totalExpensesValue) * 100;

      if (loanPercentage > 20) {
        recommendations.push({
          id: "manage-debt",
          title: "Gerencie Suas Dívidas",
          description: "Pagamentos com empréstimos estão muito altos.",
          priority: "alta",
          actionItems: [
            "Priorize o pagamento de dívidas com juros mais altos",
            "Considere consolidar dívidas para reduzir os juros",
            "Evite contrair novas dívidas enquanto não quitar as atuais",
          ],
        });
      }
    }

    Object.entries(expensesByCategory).forEach(([category, amount]) => {
      const percentage = (amount / totalExpensesValue) * 100;

      if (percentage > 30 && category !== "moradia") {
        let categoryName = "";
        let items = [];

        switch (category) {
          case "alimentacao":
            categoryName = "Alimentação";
            items = [
              "Planeje refeições para evitar desperdícios",
              "Evite comer fora com frequência",
              "Pesquise preços antes de comprar",
            ];
            break;
          case "transporte":
            categoryName = "Transporte";
            items = [
              "Use transporte público quando possível",
              "Caronas compartilhadas podem economizar combustível",
              "Reveja o custo-benefício do seu carro atual",
            ];
            break;
          case "lazer":
            categoryName = "Lazer";
            items = [
              "Busque atividades gratuitas ou baratas",
              "Evite compras por impulso em lazer",
              "Use cupons de desconto em passeios",
            ];
            break;
          default:
            categoryName = category;
            items = [
              "Analise os gastos dessa categoria",
              "Defina um limite mensal",
              "Pesquise opções mais econômicas",
            ];
        }

        recommendations.push({
          id: `optimize-${category}`,
          title: `Otimize Gastos com ${categoryName}`,
          description: `Seus gastos com ${categoryName.toLowerCase()} representam ${percentage.toFixed(
            1
          )}% do total.`,
          priority: "média",
          actionItems: items,
        });
      }
    });

    if (balance >= 0 && !recommendations.some((r) => r.id === "emergency-fund")) {
      recommendations.push({
        id: "emergency-fund",
        title: "Crie um Fundo de Emergência",
        description:
          "Tenha uma reserva para imprevistos. O ideal são 3 a 6 meses de despesas guardados.",
        priority: "média",
        actionItems: [
          "Defina uma meta (ex: 6 meses de despesas)",
          "Automatize transferências para poupança",
          "Mantenha em local seguro e acessível",
        ],
      });
    }

    if (balance > 0 && !recommendations.some((r) => r.id === "invest")) {
      recommendations.push({
        id: "invest",
        title: "Comece a Investir",
        description: "Saldo positivo? Hora de fazer seu dinheiro render.",
        priority: "baixa",
        actionItems: [
          "Estude investimentos de baixo risco",
          "Experimente Tesouro Direto ou CDBs",
          "Considere falar com um especialista financeiro",
        ],
      });
    }

    if (!recommendations.some((r) => r.id === "budget")) {
      recommendations.push({
        id: "budget",
        title: "Planeje seu Orçamento",
        description: "Um bom orçamento é o primeiro passo para ter controle financeiro.",
        priority: "média",
        actionItems: [
          "Use a regra 50-30-20",
          "Revise seu orçamento todo mês",
          "Use apps de controle financeiro",
        ],
      });
    }

    setRecommendations(recommendations);
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
    expandedInsight,
    setExpandedInsight,
    userName,
    categoryData,
    monthlyData,
    handleLogout,
    formatCurrency,
    handleExportPDF,
    setTransactions,
    setInsights,
    setRecommendations,
    setLoading,
    setError,
    setActiveTab,
    setTimeframe,
    setExpandedInsight,
    setUserName,
    setCategoryData,
    setMonthlyData,
    processChartData,
    generateInsights,
    generateRecommendations,
    fetchData,
  };
}
