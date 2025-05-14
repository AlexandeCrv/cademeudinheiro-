"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Trash2,
  Search,
  Calendar,
  ChevronDown,
  Download,
  Filter,
} from "lucide-react";
import Sidebar from "../dashboard/sidebar";
import LineChart from "../../../components/charts/linechart";

import { useTransactions } from "./useTransactions";
import { useTransactionFilters } from "./useTransactionFilters";
import { useChartData } from "./useChartData";
export default function TransactionsPage() {
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  const {
    transactions,
    setTransactions,
    filteredTransactions,
    setFilteredTransactions,
    chartData,
    setChartData,
    loading,
    error,
    userName,
    formatCurrency,
    formatTime,
    handleDelete,
    formatDate,
    fetchData,
  } = useTransactions(token);

  useTransactionFilters(
    transactions,
    searchTerm,
    activeFilter,
    dateRange,
    setFilteredTransactions
  );

  useChartData(transactions, setChartData);

  return (
    <div className="min-h-screen bg-gray-950 text-white  overflow-y-clip overflow-x-clip relative">
      {/* Sidebar */}
      <Sidebar userName={userName} onLogout={handleLogout} />
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
      <div className="ml-16 md:ml-64 p-6 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-purple-900/30">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
              Transações
            </h1>
            <p className="text-gray-400">Visualize e gerencie todas as suas transações</p>
          </div>
        </header>

        {/* Gráfico de Transações */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/50 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-6 text-white">Histórico de Transações</h2>
          <div className="h-80">
            <LineChart data={chartData} height={320} />
          </div>
        </div>

        {/* Ações e Filtros */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-900 border border-purple-900/50 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full md:w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex items-center gap-2 bg-gray-900 border border-purple-900/50 rounded-lg p-1">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1 rounded ${
                  activeFilter === "all"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-purple-400"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveFilter("entrada")}
                className={`px-3 py-1 rounded ${
                  activeFilter === "entrada"
                    ? "bg-green-600 text-white"
                    : "text-gray-400 hover:text-green-400"
                }`}
              >
                Entradas
              </button>
              <button
                onClick={() => setActiveFilter("saida")}
                className={`px-3 py-1 rounded ${
                  activeFilter === "saida"
                    ? "bg-red-600 text-white"
                    : "text-gray-400 hover:text-red-400"
                }`}
              >
                Saídas
              </button>
            </div>

            <div className="relative">
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-purple-900/50 rounded-lg shadow-lg z-10 hidden">
                {["Todos", "Hoje", "Esta semana", "Este mês"].map((period, index) => (
                  <button
                    key={index}
                    className="block w-full text-left px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-purple-400 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <button className="p-2 bg-gray-900 border border-purple-900/50 rounded-lg text-gray-400 hover:text-purple-400">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Transações */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/50 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-white">Lista de Transações</h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 text-red-400">
              {error}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma transação encontrada</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-2 text-purple-400 hover:text-purple-300"
                >
                  Limpar busca
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-5 gap-4 mb-4 text-sm text-gray-500 border-b border-gray-800 pb-2">
                <div>Título</div>
                <div>Valor</div>
                <div>Tipo</div>
                <div>Data</div>
              </div>

              <ul className="space-y-3">
                {filteredTransactions.map((t) => (
                  <li
                    key={t._id}
                    className="bg-gray-800/50 border border-gray-800 hover:border-purple-900/30 rounded-lg p-4 transition-all duration-200"
                  >
                    <div className="md:grid md:grid-cols-5 md:gap-4 md:items-center">
                      <div className="font-medium mb-1 md:mb-0">{t.title}</div>

                      <div
                        className={`text-sm md:text-base ${
                          t.type === "entrada" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {formatCurrency(t.amount)}
                      </div>

                      <div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            t.type === "entrada"
                              ? "bg-green-900/20 text-green-400 border border-green-900/30"
                              : "bg-red-900/20 text-red-400 border border-red-900/30"
                          }`}
                        >
                          {t.type === "entrada" ? (
                            <ArrowUpCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownCircle className="h-3 w-3 mr-1" />
                          )}
                          {t.type === "entrada" ? "Entrada" : "Saída"}
                        </span>
                      </div>

                      <div className="text-sm text-gray-400 flex flex-col md:flex-row md:gap-2">
                        <span>{formatDate(t.createdAt)}</span>
                        <span className="hidden md:inline text-gray-600">•</span>
                        <span>{formatTime(t.createdAt)}</span>
                      </div>

                      <div className="flex justify-end mt-2 md:mt-0"></div>
                    </div>
                  </li>
                ))}
              </ul>

              {filteredTransactions.length > 0 && (
                <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
                  <p>
                    Mostrando {filteredTransactions.length} de {transactions.length}{" "}
                    transações
                  </p>

                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 border border-gray-800 rounded hover:border-purple-900/30 hover:text-purple-400 transition-colors">
                      Anterior
                    </button>
                    <button className="px-3 py-1 bg-purple-600/20 border border-purple-900/30 rounded text-purple-400">
                      1
                    </button>
                    <button className="px-3 py-1 border border-gray-800 rounded hover:border-purple-900/30 hover:text-purple-400 transition-colors">
                      Próxima
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
