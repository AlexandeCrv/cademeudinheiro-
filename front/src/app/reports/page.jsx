"use client";

import Sidebar from "../dashboard/sidebar";
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
import ReportInsightCard from "./report-insight-card";
import SpendingCategoryChart from "./spending-category-chart";
import MonthlyTrendsChart from "./monthly-trends-chart";
import RecommendationCard from "./recommendation-card";
import useReports from "./useReports";

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
    setTransactions,
    setInsights,
    setRecommendations,
    setLoading,
    setError,

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
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-purple-900/30">
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
        </header>

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
            </div>

            {/* Tab Content */}
            {activeTab === "insights" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insights.length > 0 ? (
                  insights.map((insight) => (
                    <ReportInsightCard
                      key={insight.id}
                      insight={insight}
                      isExpanded={expandedInsight === insight.id}
                      onToggle={() =>
                        setExpandedInsight(
                          expandedInsight === insight.id ? null : insight.id
                        )
                      }
                    />
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
              </div>
            )}

            {activeTab === "recommendations" && (
              <div className="space-y-6">
                {recommendations.length > 0 ? (
                  recommendations.map((recommendation) => (
                    <RecommendationCard
                      key={recommendation.id}
                      recommendation={recommendation}
                    />
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
              </div>
            )}

            {activeTab === "charts" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 border border-purple-900/30 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-200">
                      Distribuição de Gastos por Categoria
                    </h3>
                    <PieChart className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="h-80">
                    <SpendingCategoryChart data={categoryData} />
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-purple-900/30 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-200">
                      Tendências Mensais
                    </h3>
                    <LineChart className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="h-80">
                    <MonthlyTrendsChart data={monthlyData} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
