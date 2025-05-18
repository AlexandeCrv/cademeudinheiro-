"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  BarChart3,
  Calendar,
  ChevronDown,
  Download,
  ArrowUpDown,
} from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import Sidebar from "../dashboard/sidebar";
import { useRouter } from "next/navigation";
import useCategories from "./useCategories";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function CategoriesPage() {
  const router = useRouter();
  const {
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
  } = useCategories();

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-y-clip overflow-x-clip relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-gray-950 to-gray-900"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-violet-900/20 rounded-full filter blur-3xl"></div>

        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[linear-gradient(to_right,#8B5CF6_1px,transparent_1px),linear-gradient(to_bottom,#8B5CF6_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
      </div>
      <Sidebar userName={userName} onLogout={handleLogout} activePage="categories" />

      <div className="ml-16 md:ml-64 p-6 relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
            Análise de Categorias
          </h1>
          <p className="text-gray-400">Visualize seus gastos e receitas por categoria</p>
        </motion.header>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-gray-900 border border-purple-900/50 rounded-lg px-4 py-2 text-gray-300 hover:text-purple-400"
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            >
              <Calendar className="h-4 w-4" />
              <span>
                {period === "month"
                  ? "Este Mês"
                  : period === "quarter"
                  ? "Último Trimestre"
                  : period === "year"
                  ? "Este Ano"
                  : "Todo Período"}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showPeriodDropdown && (
              <div className="absolute z-10 mt-2 w-48 bg-gray-900 border border-purple-900/50 rounded-lg shadow-lg">
                {[
                  { id: "month", label: "Este Mês" },
                  { id: "quarter", label: "Último Trimestre" },
                  { id: "year", label: "Este Ano" },
                  { id: "all", label: "Todo Período" },
                ].map((item) => (
                  <button
                    key={item.id}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-800 ${
                      period === item.id ? "text-purple-400" : "text-gray-300"
                    }`}
                    onClick={() => {
                      setPeriod(item.id);
                      setShowPeriodDropdown(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 bg-gray-900 border border-purple-900/50 rounded-lg p-1">
            <button
              onClick={() => setCategoryType("all")}
              className={`px-3 py-1 rounded ${
                categoryType === "all"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-purple-400"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setCategoryType("entrada")}
              className={`px-3 py-1 rounded ${
                categoryType === "entrada"
                  ? "bg-green-600 text-white"
                  : "text-gray-400 hover:text-green-400"
              }`}
            >
              Entradas
            </button>
            <button
              onClick={() => setCategoryType("saida")}
              className={`px-3 py-1 rounded ${
                categoryType === "saida"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-red-400"
              }`}
            >
              Saídas
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 text-red-400">
            {error}
          </div>
        ) : categoryData.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/50 rounded-xl p-8 text-center shadow-lg">
            <PieChart className="h-16 w-16 text-purple-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-white mb-2">
              Nenhuma transação encontrada
            </h3>
            <p className="text-gray-400 mb-6">
              Adicione transações para visualizar análises por categoria
            </p>
          </div>
        ) : (
          <>
            {/* Resumo */}
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/50 rounded-xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      Total por Categorias
                    </h3>
                    <p className="text-gray-400 text-sm">Distribuição de valores</p>
                  </div>
                  <div className="p-2 bg-purple-900/20 rounded-lg">
                    <PieChart className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <div className="h-64">
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/50 rounded-xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">Comparativo</h3>
                    <p className="text-gray-400 text-sm">Valores por categoria</p>
                  </div>
                  <div className="p-2 bg-purple-900/20 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <div className="h-64">
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/50 rounded-xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      Principais Categorias
                    </h3>
                    <p className="text-gray-400 text-sm">Top 5 por valor</p>
                  </div>
                  <div className="p-2 bg-purple-900/20 rounded-lg">
                    <ArrowUpDown className="h-5 w-5 text-purple-400" />
                  </div>
                </div>

                <div className="space-y-4">
                  {categoryData.slice(0, 5).map((category) => (
                    <div key={category.id} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white">{category.name}</span>
                          <span className="text-gray-300">
                            {formatCurrency(category.amount)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${category.percentage}%`,
                              backgroundColor: category.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.header>

            {/* Lista de Categorias */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/50 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-medium text-white mb-6">
                Detalhamento por Categoria
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-800">
                      <th className="pb-3 font-medium">Categoria</th>
                      <th className="pb-3 font-medium">Valor Total</th>
                      <th className="pb-3 font-medium">% do Total</th>
                      <th className="pb-3 font-medium">Transações</th>
                      <th className="pb-3 font-medium">Média por Transação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryData.map((category) => (
                      <tr
                        key={category.id}
                        className="border-b border-gray-800/50 hover:bg-gray-800/30"
                      >
                        <td className="py-4">
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-3"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span className="text-white">{category.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-white">
                          {formatCurrency(category.amount)}
                        </td>
                        <td className="py-4 text-white">
                          {category.percentage.toFixed(1)}%
                        </td>
                        <td className="py-4 text-white">{category.count}</td>
                        <td className="py-4 text-white">
                          {formatCurrency(category.amount / category.count)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
