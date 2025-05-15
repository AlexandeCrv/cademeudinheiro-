"use client";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import useReports from "./useReports";
import Sidebar from "../dashboard/sidebar";
import { Info, Download, LineChartIcon, Lightbulb } from "lucide-react";
import AIChatBubble from "./ai-chat-bubble";

import EnhancedInsightCard from "./report-insight-card";
import EnhancedRecommendationCard from "./recommendation-card";
import SpendingBreakdownChart from "./spending-breakdown-chart";
import ForecastChart from "./forecast-chart";

export default function ReportsPage() {
  const {
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
    containerVariants,
    itemVariants,
    historicalData,
    forecastData,
    setForecastData,

    setHistoricalData,
    fetchData,
  } = useReports();

  return (
    <div className="min-h-screen bg-gray-950 relative text-white overflow-y-clip overflow-x-clip">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-gray-950 to-gray-900"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-violet-900/20 rounded-full filter blur-3xl"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[linear-gradient(to_right,#8B5CF6_1px,transparent_1px),linear-gradient(to_bottom,#8B5CF6_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-16 relative z-10 md:ml-64 p-6">
        {/* Header */}
        <motion.header
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-purple-900/30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
              Relatórios Financeiros
            </h1>
            <p className="text-gray-400">
              Análises e recomendações personalizadas para suas finanças
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <div className="flex items-center gap-2 bg-gray-900 border border-purple-900/50 rounded-lg p-1">
              <button
                onClick={() => setTimeframe("month")}
                className={`px-3 py-1 rounded text-sm ${
                  timeframe === "month"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-purple-400"
                }`}
              >
                Mês Atual
              </button>
              <button
                onClick={() => setTimeframe("quarter")}
                className={`px-3 py-1 rounded text-sm ${
                  timeframe === "quarter"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-purple-400"
                }`}
              >
                Trimestre
              </button>
              <button
                onClick={() => setTimeframe("year")}
                className={`px-3 py-1 rounded text-sm ${
                  timeframe === "year"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-purple-400"
                }`}
              >
                Ano
              </button>
            </div>

            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="h-4 w-4" />
              Exportar PDF
            </button>
          </div>
        </motion.header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Carregando suas análises financeiras...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b border-purple-900/30 mb-6">
              <button
                onClick={() => setActiveTab("insights")}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "insights"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-purple-300"
                }`}
              >
                Insights
              </button>
              <button
                onClick={() => setActiveTab("recommendations")}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "recommendations"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-purple-300"
                }`}
              >
                Recomendações
              </button>
              <button
                onClick={() => setActiveTab("charts")}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "charts"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-purple-300"
                }`}
              >
                Gráficos
              </button>
              <button
                onClick={() => setActiveTab("forecast")}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "forecast"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-purple-300"
                }`}
              >
                Previsões
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "insights" && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {insights.length > 0 ? (
                  insights.map((insight) => (
                    <motion.div key={insight.id} variants={itemVariants}>
                      <EnhancedInsightCard
                        insight={insight}
                        isExpanded={expandedInsight === insight.id}
                        onToggle={() =>
                          setExpandedInsight(
                            expandedInsight === insight.id ? null : insight.id
                          )
                        }
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 bg-gray-900/50 border border-purple-900/30 rounded-lg p-6 text-center">
                    <Info className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                    <h3 className="text-lg font-medium text-gray-300">
                      Sem insights disponíveis
                    </h3>
                    <p className="text-gray-400 mt-2">
                      Adicione mais transações para que possamos gerar insights
                      personalizados para você.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "recommendations" && (
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {recommendations.length > 0 ? (
                  recommendations.map((recommendation) => (
                    <motion.div key={recommendation.id} variants={itemVariants}>
                      <EnhancedRecommendationCard recommendation={recommendation} />
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-gray-900/50 border border-purple-900/30 rounded-lg p-6 text-center">
                    <Lightbulb className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                    <h3 className="text-lg font-medium text-gray-300">
                      Sem recomendações disponíveis
                    </h3>
                    <p className="text-gray-400 mt-2">
                      Adicione mais transações para que possamos gerar recomendações
                      personalizadas para você.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "charts" && (
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="bg-gray-900/50 border border-purple-900/30 rounded-lg p-6 h-[500px]"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <SpendingBreakdownChart data={categoryData} />
                </motion.div>

                <motion.div
                  className="bg-gray-900/50 border border-purple-900/30 rounded-lg p-6 h-[500px]"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-200">
                      Tendências Mensais
                    </h3>
                    <LineChartIcon className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="h-[calc(100%-2rem)]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis
                          dataKey="month"
                          tick={{ fill: "#9CA3AF" }}
                          axisLine={{ stroke: "#4B5563" }}
                        />
                        <YAxis
                          tick={{ fill: "#9CA3AF" }}
                          axisLine={{ stroke: "#4B5563" }}
                          tickFormatter={(value) => `R$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={renderCustomizedLegend} />
                        <Line
                          type="monotone"
                          dataKey="income"
                          name="Receitas"
                          stroke="#10B981"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="expense"
                          name="Despesas"
                          stroke="#EF4444"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="balance"
                          name="Saldo"
                          stroke="#8B5CF6"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === "forecast" && (
              <motion.div
                className="grid grid-cols-1 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="bg-gray-900/50 border border-purple-900/30 rounded-lg p-6 h-[500px]"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <ForecastChart
                    historicalData={historicalData}
                    forecastData={forecastData}
                  />
                </motion.div>

                <motion.div
                  className="bg-gray-900/50 border border-purple-900/30 rounded-lg p-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-medium text-gray-200">
                      Sobre as Previsões Financeiras
                    </h3>
                  </div>

                  <div className="space-y-4 text-gray-300 text-sm">
                    <p>
                      As previsões financeiras são baseadas nos seus padrões históricos de
                      gastos e receitas, ajustadas para tendências sazonais e inflação.
                      Elas servem como uma estimativa do que pode acontecer se você
                      mantiver seus padrões atuais de gastos e receitas.
                    </p>

                    <p>
                      <span className="font-medium text-purple-400">
                        Como usar estas previsões:
                      </span>
                    </p>

                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-medium">Planejamento de orçamento:</span>{" "}
                        Use as previsões para antecipar meses com maiores despesas e
                        planejar seu orçamento adequadamente.
                      </li>
                      <li>
                        <span className="font-medium">Metas de economia:</span> Estabeleça
                        metas de economia realistas com base nas previsões de saldo
                        positivo.
                      </li>
                      <li>
                        <span className="font-medium">Identificação de tendências:</span>{" "}
                        Observe tendências de aumento de gastos e tome medidas
                        preventivas.
                      </li>
                      <li>
                        <span className="font-medium">Planejamento de longo prazo:</span>{" "}
                        Use as previsões para planejar grandes compras ou investimentos
                        futuros.
                      </li>
                    </ul>

                    <p className="text-amber-400 bg-amber-900/20 p-3 rounded-lg">
                      <span className="font-medium">Nota:</span> Estas previsões são
                      estimativas baseadas em dados históricos e podem não refletir
                      mudanças futuras em sua situação financeira ou na economia. Revise e
                      ajuste seu planejamento regularmente.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </>
        )}
        {/* AI Chat Bubble */}
        <AIChatBubble
          onSendPrompt={async (prompt) => {
            try {
              const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;
              const response = await fetch("http://localhost:3001/ai/insight", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ prompt }),
              });
              const data = await response.json();
              return data.result || "Sem resposta da IA.";
            } catch (error) {
              console.error("Error sending prompt to AI:", error);
              return "Erro ao obter resposta.";
            }
          }}
        />
      </div>
    </div>
  );
}

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-3 rounded border border-gray-700 shadow-lg">
        <p className="text-sm font-medium text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={`item-${index}`}
            className="text-xs flex justify-between gap-4"
            style={{ color: entry.color }}
          >
            <span>{entry.name}:</span>
            <span className="font-medium">
              {entry.value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom legend for charts
const renderCustomizedLegend = (props) => {
  const { payload } = props;

  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-1 text-xs">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-300">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};
