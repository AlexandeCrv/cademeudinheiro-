"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  DollarSign,
  CreditCard,
  Wallet,
  ShoppingBag,
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  BarChart4,
  PiggyBank,
  Landmark,
} from "lucide-react";

export default function useInsightGenerator(transactions, summary) {
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (transactions.length > 0 && summary) {
      generateEnhancedInsights(transactions, summary);
      generateEnhancedRecommendations(transactions, summary);
    }
  }, [transactions, summary]);

  const generateEnhancedInsights = (transactions, summary) => {
    const newInsights = [];

    const totalIncome = summary.entradas || 0;
    const totalExpenses = summary.saidas || 0;
    const balance = totalIncome - totalExpenses;

    const expensesByCategory = {};
    const incomesByCategory = {};
    const expensesByMonth = {};
    const lastThreeMonthsExpenses = [];

    // Process transactions
    transactions.forEach((transaction) => {
      const amount =
        typeof transaction.amount === "object" && transaction.amount.$numberDecimal
          ? Number.parseFloat(transaction.amount.$numberDecimal)
          : Number.parseFloat(transaction.amount);

      // Process by category
      if (transaction.type === "saida") {
        const category = transaction.category || "outros_saida";
        expensesByCategory[category] = (expensesByCategory[category] || 0) + amount;

        // Process by month
        const date = new Date(transaction.createdAt);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

        if (!expensesByMonth[monthYear]) {
          expensesByMonth[monthYear] = 0;
        }
        expensesByMonth[monthYear] += amount;
      } else {
        const category = transaction.category || "outros_entrada";
        incomesByCategory[category] = (incomesByCategory[category] || 0) + amount;
      }
    });

    // Calculate last three months expenses for trend analysis
    const months = Object.keys(expensesByMonth).sort((a, b) => {
      const [monthA, yearA] = a.split("/").map(Number);
      const [monthB, yearB] = b.split("/").map(Number);
      return yearB - yearA || monthB - monthA;
    });

    for (let i = 0; i < Math.min(3, months.length); i++) {
      lastThreeMonthsExpenses.push(expensesByMonth[months[i]]);
    }

    if (balance >= 0) {
      newInsights.push({
        id: "balance-positive",
        title: "Saldo Positivo",
        description: `Você tem um saldo positivo de ${formatCurrency(
          balance
        )} neste período.`,
        icon: TrendingUp,
        color: "green",
        details:
          "Manter um saldo positivo é essencial para a saúde financeira. Continue controlando seus gastos e economizando para atingir seus objetivos financeiros de longo prazo.",
        actions: [
          { label: "Investir", icon: Landmark },
          { label: "Economizar", icon: PiggyBank },
        ],
      });
    } else {
      newInsights.push({
        id: "balance-negative",
        title: "Saldo Negativo",
        description: `Você tem um saldo negativo de ${formatCurrency(
          Math.abs(balance)
        )} neste período.`,
        icon: TrendingDown,
        color: "red",
        details:
          "Um saldo negativo indica que você está gastando mais do que ganha. Considere reduzir despesas não essenciais e criar um orçamento mais rigoroso para evitar endividamento.",
        actions: [
          { label: "Reduzir gastos", icon: ShoppingBag },
          { label: "Criar orçamento", icon: DollarSign },
        ],
      });
    }

    const totalExpensesValue = Object.values(expensesByCategory).reduce(
      (sum, value) => sum + value,
      0
    );

    Object.entries(expensesByCategory).forEach(([category, amount]) => {
      const percentage = (amount / totalExpensesValue) * 100;

      if (percentage > 30) {
        const categoryName = getCategoryName(category);
        const icon = getCategoryIcon(category);
        let color = "amber";
        let details = `Você está gastando uma proporção significativa do seu orçamento em ${categoryName.toLowerCase()}. Considere analisar esses gastos para possíveis ajustes.`;
        const actions = [
          { label: "Analisar gastos", icon: BarChart4 },
          { label: "Definir limite", icon: Target },
        ];

        if (category === "moradia" && percentage > 40) {
          color = "red";
          details =
            "Especialistas recomendam que os gastos com moradia não ultrapassem 30% da sua renda. Considere alternativas para reduzir este custo ou aumentar sua renda.";
        }

        // Special case for leisure
        if (category === "lazer" && percentage > 20) {
          color = "red";
          details =
            "Seus gastos com lazer estão muito altos em relação ao seu orçamento total. Considere alternativas mais econômicas para entretenimento.";
        }

        newInsights.push({
          id: `high-spending-${category.toLowerCase()}`,
          title: `Alto Gasto em ${categoryName}`,
          description: `${percentage.toFixed(
            1
          )}% dos seus gastos são em ${categoryName} (${formatCurrency(amount)}).`,
          icon,
          color,
          details,
          actions,
        });
      }
    });

    // 3. Loan/Debt Insights
    if (expensesByCategory["emprestimos"] > 0) {
      const loanAmount = expensesByCategory["emprestimos"];
      const loanPercentage = (loanAmount / totalExpensesValue) * 100;

      if (loanPercentage > 20) {
        newInsights.push({
          id: "high-loan-payments",
          title: "Pagamentos de Empréstimos Elevados",
          description: `${loanPercentage.toFixed(
            1
          )}% dos seus gastos são com empréstimos (${formatCurrency(loanAmount)}).`,
          icon: AlertTriangle,
          color: "red",
          details:
            "Uma alta proporção de pagamentos de empréstimos pode comprometer sua saúde financeira. Considere estratégias para reduzir suas dívidas mais rapidamente, como consolidação de dívidas ou renegociação de taxas.",
          actions: [
            { label: "Consolidar dívidas", icon: CreditCard },
            { label: "Renegociar taxas", icon: DollarSign },
          ],
        });
      }
    }

    // 4. Savings Rate Insight
    if (balance > 0) {
      const savingsRate = (balance / totalIncome) * 100;

      if (savingsRate < 10) {
        newInsights.push({
          id: "low-savings-rate",
          title: "Taxa de Economia Baixa",
          description: `Você está economizando apenas ${savingsRate.toFixed(
            1
          )}% da sua renda.`,
          icon: Info,
          color: "amber",
          details:
            "Especialistas recomendam economizar pelo menos 20% da sua renda. Tente aumentar sua taxa de economia para uma reserva mais sólida e garantir segurança financeira no futuro.",
          actions: [
            { label: "Aumentar economia", icon: PiggyBank },
            { label: "Reduzir gastos", icon: ShoppingBag },
          ],
        });
      } else if (savingsRate >= 20) {
        newInsights.push({
          id: "good-savings-rate",
          title: "Boa Taxa de Economia",
          description: `Você está economizando ${savingsRate.toFixed(1)}% da sua renda.`,
          icon: TrendingUp,
          color: "green",
          details:
            "Parabéns! Sua taxa de economia é excelente e contribui para sua segurança financeira de longo prazo. Continue assim e considere investir parte desse valor para fazer seu dinheiro trabalhar para você.",
          actions: [
            { label: "Investir", icon: Landmark },
            { label: "Planejar futuro", icon: Calendar },
          ],
        });
      }
    }

    // 5. Fixed Expenses Insight
    const fixedCategories = ["moradia", "transporte", "educacao", "saude"];
    const fixedTotal = fixedCategories.reduce(
      (sum, cat) => sum + (expensesByCategory[cat] || 0),
      0
    );
    const fixedPercentage = (fixedTotal / totalExpensesValue) * 100;

    if (fixedPercentage > 70) {
      newInsights.push({
        id: "high-fixed-expenses",
        title: "Gastos Fixos Muito Altos",
        description: `Seus gastos fixos representam ${fixedPercentage.toFixed(
          1
        )}% do total.`,
        icon: AlertTriangle,
        color: "red",
        details:
          "Quando os gastos fixos ultrapassam 70% das despesas, sobra pouco espaço para economias ou imprevistos. Reavalie seus compromissos mensais se possível e busque alternativas mais econômicas.",
        actions: [
          { label: "Renegociar contratos", icon: DollarSign },
          { label: "Buscar alternativas", icon: ShoppingBag },
        ],
      });
    }

    // 6. Spending Trend Insight
    if (lastThreeMonthsExpenses.length >= 2) {
      const currentMonth = lastThreeMonthsExpenses[0];
      const previousMonth = lastThreeMonthsExpenses[1];
      const percentageChange = ((currentMonth - previousMonth) / previousMonth) * 100;

      if (percentageChange > 15) {
        newInsights.push({
          id: "increasing-expenses",
          title: "Aumento de Gastos",
          description: `Seus gastos aumentaram ${percentageChange.toFixed(
            1
          )}% em relação ao mês anterior.`,
          icon: ArrowUpRight,
          color: "red",
          details:
            "Um aumento significativo nos gastos pode indicar despesas extraordinárias ou um padrão de consumo crescente. Analise as categorias que mais contribuíram para esse aumento.",
          actions: [
            { label: "Analisar tendência", icon: BarChart4 },
            { label: "Ajustar orçamento", icon: Wallet },
          ],
        });
      } else if (percentageChange < -10) {
        newInsights.push({
          id: "decreasing-expenses",
          title: "Redução de Gastos",
          description: `Seus gastos diminuíram ${Math.abs(percentageChange).toFixed(
            1
          )}% em relação ao mês anterior.`,
          icon: ArrowDownRight,
          color: "green",
          details:
            "Parabéns pela redução de gastos! Continue monitorando suas despesas e mantendo o controle financeiro para alcançar seus objetivos.",
          actions: [
            { label: "Continuar economia", icon: PiggyBank },
            { label: "Investir diferença", icon: Landmark },
          ],
        });
      }
    }

    // 7. Credit Card Insight
    if (expensesByCategory["cartao_credito"] > 0) {
      const creditCardAmount = expensesByCategory["cartao_credito"];
      const creditCardPercentage = (creditCardAmount / totalExpensesValue) * 100;

      if (creditCardPercentage > 25) {
        newInsights.push({
          id: "high-credit-card",
          title: "Alto Uso de Cartão de Crédito",
          description: `${creditCardPercentage.toFixed(
            1
          )}% dos seus gastos são no cartão de crédito.`,
          icon: CreditCard,
          color: "amber",
          details:
            "Um alto percentual de gastos no cartão de crédito pode levar a dívidas se não for pago integralmente. Monitore esses gastos e evite o pagamento mínimo da fatura.",
          actions: [
            { label: "Pagar fatura integral", icon: DollarSign },
            { label: "Reduzir uso do cartão", icon: CreditCard },
          ],
        });
      }
    }

    // 8. Income Diversity Insight
    const incomeCategories = Object.keys(incomesByCategory).length;
    if (incomeCategories === 1 && totalIncome > 0) {
      newInsights.push({
        id: "single-income-source",
        title: "Fonte Única de Renda",
        description: "Você depende de apenas uma fonte de renda.",
        icon: Wallet,
        color: "blue",
        details:
          "Depender de uma única fonte de renda pode ser arriscado. Considere diversificar suas fontes de renda para maior segurança financeira.",
        actions: [
          { label: "Explorar renda extra", icon: Zap },
          { label: "Investir para dividendos", icon: Landmark },
        ],
      });
    }

    setInsights(newInsights);
  };

  const generateEnhancedRecommendations = (transactions, summary) => {
    const newRecommendations = [];

    const totalIncome = summary.entradas || 0;
    const totalExpenses = summary.saidas || 0;
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

    // 1. Budget Recommendation
    newRecommendations.push({
      id: "budget-50-30-20",
      title: "Adote a Regra 50-30-20",
      description: "Um método simples e eficaz para organizar seu orçamento.",
      priority: "média",
      impact: "alto",
      timeframe: "imediato",
      actionItems: [
        "Destine 50% da sua renda para necessidades básicas (moradia, alimentação, contas)",
        "Reserve 30% para desejos e lazer",
        "Guarde 20% para economias e investimentos",
        "Revise seu orçamento mensalmente e ajuste conforme necessário",
      ],
    });

    // 2. Negative Balance Recommendation
    if (balance < 0) {
      newRecommendations.push({
        id: "reduce-expenses",
        title: "Plano de Redução de Despesas",
        description:
          "Seus gastos estão superando sua renda. Implemente um plano de corte.",
        priority: "alta",
        impact: "alto",
        timeframe: "imediato",
        actionItems: [
          "Identifique e elimine assinaturas e serviços não utilizados",
          "Renegocie contas fixas como internet, celular e seguros",
          "Substitua refeições fora por refeições preparadas em casa",
          "Estabeleça um limite diário de gastos e monitore-o rigorosamente",
          "Evite compras por impulso com a regra das 72 horas para decisões de compra",
        ],
      });
    }

    // 3. Debt Management Recommendation
    if (expensesByCategory["emprestimos"] || expensesByCategory["cartao_credito"]) {
      const debtAmount =
        (expensesByCategory["emprestimos"] || 0) +
        (expensesByCategory["cartao_credito"] || 0);
      const debtPercentage = (debtAmount / totalExpensesValue) * 100;

      if (debtPercentage > 15) {
        newRecommendations.push({
          id: "debt-snowball",
          title: "Método Bola de Neve para Dívidas",
          description: "Estratégia eficaz para eliminar dívidas de forma motivadora.",
          priority: "alta",
          impact: "alto",
          timeframe: "médio prazo",
          actionItems: [
            "Liste todas as suas dívidas do menor para o maior valor",
            "Faça o pagamento mínimo de todas as dívidas",
            "Direcione todo dinheiro extra para quitar a menor dívida primeiro",
            "Quando quitar a primeira dívida, direcione esse valor para a próxima",
            "Continue o processo até eliminar todas as dívidas",
          ],
        });
      }
    }

    // 4. Emergency Fund Recommendation
    if (balance >= 0) {
      newRecommendations.push({
        id: "emergency-fund",
        title: "Crie um Fundo de Emergência",
        description: "Segurança financeira para imprevistos e momentos difíceis.",
        priority: "alta",
        impact: "médio",
        timeframe: "curto prazo",
        actionItems: [
          "Defina uma meta de 3 a 6 meses de despesas essenciais",
          "Configure uma transferência automática mensal para este fundo",
          "Mantenha o dinheiro em uma conta de alta liquidez e baixo risco",
          "Use este fundo APENAS para verdadeiras emergências",
          "Reponha o valor sempre que precisar utilizá-lo",
        ],
      });
    }

    // 5. Category-specific Recommendations
    Object.entries(expensesByCategory).forEach(([category, amount]) => {
      const percentage = (amount / totalExpensesValue) * 100;

      if (percentage > 25 && category !== "moradia") {
        let title = "";
        let description = "";
        let items = [];
        const priority = "média";
        const impact = "médio";
        const timeframe = "curto prazo";

        switch (category) {
          case "alimentacao":
            title = "Otimize Gastos com Alimentação";
            description = "Estratégias para economizar sem comprometer a qualidade.";
            items = [
              "Planeje refeições semanalmente para evitar desperdícios",
              "Faça uma lista de compras e siga-a rigorosamente",
              "Compare preços entre mercados e aproveite promoções",
              "Reduza refeições em restaurantes para ocasiões especiais",
              "Prepare marmitas para o trabalho/estudos",
            ];
            break;
          case "transporte":
            title = "Reduza Custos de Transporte";
            description = "Alternativas para economizar em deslocamentos diários.";
            items = [
              "Avalie a possibilidade de usar transporte público",
              "Organize caronas compartilhadas com colegas",
              "Considere alternativas como bicicleta para trajetos curtos",
              "Faça manutenção preventiva do veículo para evitar gastos maiores",
              "Compare preços de combustível e abasteça em postos mais econômicos",
            ];
            break;
          case "lazer":
            title = "Lazer Econômico e Consciente";
            description = "Aproveite momentos de diversão sem comprometer o orçamento.";
            items = [
              "Busque atividades gratuitas ou de baixo custo na sua cidade",
              "Utilize aplicativos de descontos para restaurantes e entretenimento",
              "Estabeleça um orçamento mensal específico para lazer",
              "Considere assinaturas compartilhadas de streaming",
              "Planeje viagens com antecedência para conseguir melhores preços",
            ];
            break;
          default:
            break; // Skip other categories
        }

        newRecommendations.push({
          id: `optimize-${category}`,
          title,
          description,
          priority,
          impact,
          timeframe,
          actionItems: items,
        });
      }
    });

    // 6. Investment Recommendation
    if (balance > 0 && balance / totalIncome > 0.1) {
      newRecommendations.push({
        id: "start-investing",
        title: "Comece a Investir Hoje",
        description:
          "Faça seu dinheiro trabalhar para você com uma estratégia adequada ao seu perfil.",
        priority: "média",
        impact: "alto",
        timeframe: "curto prazo",
        actionItems: [
          "Determine seu perfil de investidor (conservador, moderado ou arrojado)",
          "Comece com investimentos de baixo risco como Tesouro Direto",
          "Diversifique gradualmente seus investimentos",
          "Considere investimentos automáticos mensais",
          "Busque educação financeira contínua sobre investimentos",
        ],
      });
    }

    // 7. Financial Education Recommendation
    newRecommendations.push({
      id: "financial-education",
      title: "Invista em Educação Financeira",
      description: "O conhecimento é o melhor investimento para suas finanças.",
      priority: "baixa",
      impact: "alto",
      timeframe: "longo prazo",
      actionItems: [
        "Leia pelo menos um livro sobre finanças pessoais por trimestre",
        "Acompanhe blogs e canais especializados em finanças",
        "Participe de cursos gratuitos online sobre o tema",
        "Estabeleça metas financeiras claras e mensuráveis",
        "Compartilhe conhecimentos com família e amigos para fortalecer bons hábitos",
      ],
    });

    // 8. Income Increase Recommendation
    newRecommendations.push({
      id: "increase-income",
      title: "Estratégias para Aumentar sua Renda",
      description: "Diversifique suas fontes de renda para maior segurança financeira.",
      priority: "média",
      impact: "alto",
      timeframe: "médio prazo",
      actionItems: [
        "Identifique habilidades que você pode monetizar como freelancer",
        "Considere um trabalho de meio período ou projetos pontuais",
        "Invista em qualificação profissional para promoções ou melhores oportunidades",
        "Explore a venda de itens não utilizados",
        "Avalie a possibilidade de alugar espaços ou bens que você possui",
      ],
    });

    // 9. Automated Savings Recommendation
    newRecommendations.push({
      id: "automated-savings",
      title: "Automatize suas Economias",
      description: "Torne o hábito de economizar automático e indolor.",
      priority: "baixa",
      impact: "médio",
      timeframe: "imediato",
      actionItems: [
        "Configure transferências automáticas para poupança no dia do recebimento",
        "Utilize aplicativos que arredondam compras e poupam a diferença",
        "Estabeleça metas específicas para suas economias (viagem, carro, etc.)",
        "Aumente gradualmente o percentual economizado a cada 3 meses",
        "Crie contas separadas para diferentes objetivos financeiros",
      ],
    });

    setRecommendations(newRecommendations);
  };

  // Helper functions
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case "alimentacao":
        return ShoppingBag;
      case "transporte":
        return TrendingUp;
      case "lazer":
        return TrendingUp;
      case "moradia":
        return TrendingUp;
      case "saude":
        return TrendingUp;
      case "educacao":
        return TrendingUp;
      case "emprestimos":
        return CreditCard;
      case "cartao_credito":
        return CreditCard;
      case "outros_saida":
        return DollarSign;
      default:
        return DollarSign;
    }
  };

  return { insights, recommendations };
}
