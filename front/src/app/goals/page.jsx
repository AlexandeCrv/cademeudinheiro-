"use client";

import {
  Target,
  Plus,
  Trash2,
  Edit,
  X,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import Sidebar from "../dashboard/sidebar";
import { motion } from "framer-motion";
import useMetas from "./metas";
export default function GoalsPage() {
  const {
    userName,
    goals,
    loading,
    error,
    title,
    targetAmount,
    deadline,
    displayAmount,
    isModalOpen,
    isSubmitting,

    showCelebration,
    editingGoal,
    openModal,
    closeModal,
    handleSubmit,
    deleteGoal,
    updateGoalProgress,
    handleCurrencyChange,
    calculateDaysRemaining,
    getProgressColor,
    formatCurrency,
    setTitle,

    setTargetAmount,
    setDeadline,
    handleLogout,
  } = useMetas();

  return (
    <div className="min-h-screen bg-gray-950 text-white  overflow-y-clip overflow-x-clip relative">
      <Sidebar userName={userName} onLogout={handleLogout} activePage="goals" />
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-gray-950 to-gray-900"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-violet-900/20 rounded-full filter blur-3xl"></div>

        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[linear-gradient(to_right,#8B5CF6_1px,transparent_1px),linear-gradient(to_bottom,#8B5CF6_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
      </div>
      <div className="ml-16 md:ml-64 p-6 z-10 relative">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
              Metas Financeiras
            </h1>
            <p className="text-gray-400">Defina e acompanhe suas metas financeiras</p>
          </div>

          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-purple-900/30"
          >
            <Plus className="h-5 w-5" />
            <span>Nova Meta</span>
          </button>
        </motion.header>

        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-2xl p-8 text-center animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">Meta Atingida!</h2>
              <p className="text-purple-300">
                Parabéns por alcançar sua meta financeira!
              </p>
              <div className="mt-4">
                <Sparkles className="h-8 w-8 text-yellow-400 mx-auto" />
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 text-red-400 mb-6">
            {error}
          </div>
        ) : goals.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/50 rounded-xl p-8 text-center shadow-lg">
            <Target className="h-16 w-16 text-purple-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-white mb-2">Nenhuma meta definida</h3>
            <p className="text-gray-400 mb-6">
              Comece a definir suas metas financeiras para acompanhar seu progresso
            </p>
            <button
              onClick={() => openModal()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors shadow-lg shadow-purple-900/30"
            >
              Criar Primeira Meta
            </button>
          </div>
        ) : (
          <>
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/50 rounded-xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">Total de Metas</h3>
                    <p className="text-gray-400 text-sm">Metas ativas e concluídas</p>
                  </div>
                  <div className="p-2 bg-purple-900/20 rounded-lg">
                    <Target className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-white">{goals.length}</p>
                    <p className="text-green-400 text-sm">
                      {goals.filter((g) => g.completed).length} concluídas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Em andamento</p>
                    <p className="text-purple-400 font-medium">
                      {goals.filter((g) => !g.completed).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/50 rounded-xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">Valor Total</h3>
                    <p className="text-gray-400 text-sm">Soma de todas as metas</p>
                  </div>
                  <div className="p-2 bg-purple-900/20 rounded-lg">
                    <DollarSign className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {formatCurrency(
                        goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
                      )}
                    </p>
                    <p className="text-green-400 text-sm">
                      {formatCurrency(
                        goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
                      )}{" "}
                      acumulado
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Restante</p>
                    <p className="text-purple-400 font-medium">
                      {formatCurrency(
                        goals.reduce(
                          (sum, goal) => sum + goal.targetAmount - goal.currentAmount,
                          0
                        )
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/50 rounded-xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">Progresso Geral</h3>
                    <p className="text-gray-400 text-sm">Média de todas as metas</p>
                  </div>
                  <div className="p-2 bg-purple-900/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                  </div>
                </div>

                {(() => {
                  const totalTarget = goals.reduce(
                    (sum, goal) => sum + goal.targetAmount,
                    0
                  );
                  const totalCurrent = goals.reduce(
                    (sum, goal) => sum + goal.currentAmount,
                    0
                  );
                  const progress =
                    totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

                  return (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-3xl font-bold text-white">
                          {progress.toFixed(0)}%
                        </p>
                        <p className="text-right text-gray-400 text-sm">
                          {formatCurrency(totalCurrent)} / {formatCurrency(totalTarget)}
                        </p>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full bg-purple-600"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.header>

            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {goals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                const daysRemaining = calculateDaysRemaining(goal.deadline);
                const progressColor = getProgressColor(goal);

                return (
                  <div
                    key={goal.id}
                    className={`bg-gradient-to-br from-gray-900 to-gray-800 border ${
                      goal.completed
                        ? "border-green-500/50"
                        : daysRemaining < 0
                        ? "border-red-500/50"
                        : "border-purple-900/50"
                    } rounded-xl p-6 shadow-lg`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: goal.color }}
                            ></div>
                            <h3 className="text-lg font-medium text-white">
                              {goal.title}
                            </h3>
                            {goal.completed && (
                              <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                                Concluída
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(goal)}
                              className="p-1.5 text-gray-400 hover:text-purple-400 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteGoal(goal.id)}
                              className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-400">
                            <DollarSign className="h-4 w-4" />
                            <span>Meta: {formatCurrency(goal.targetAmount)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {daysRemaining < 0
                                ? "Prazo expirado"
                                : daysRemaining === 0
                                ? "Prazo: Hoje"
                                : `Prazo: ${daysRemaining} dias`}
                            </span>
                          </div>
                        </div>

                        <div className="mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">
                                {progress.toFixed(0)}%
                              </span>
                              {daysRemaining < 0 && !goal.completed && (
                                <span className="flex items-center gap-1 text-red-400 text-xs">
                                  <AlertTriangle className="h-3 w-3" />
                                  Prazo expirado
                                </span>
                              )}
                            </div>
                            <span className="text-gray-400 text-sm">
                              {formatCurrency(goal.currentAmount)} /{" "}
                              {formatCurrency(goal.targetAmount)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${progressColor}`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {!goal.completed && (
                        <div className="flex flex-col gap-4 w-full md:w-auto">
                          {/* Botões rápidos */}
                          <div className="flex flex-wrap gap-2">
                            {[100, 500, 1000].map((targetAmount) => (
                              <button
                                key={targetAmount}
                                onClick={() => updateGoalProgress(goal.id, targetAmount)}
                                className="bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 px-3 py-2 rounded-lg text-sm transition-colors"
                              >
                                + {formatCurrency(targetAmount)}
                              </button>
                            ))}
                          </div>

                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const raw = targetAmount.replace(/\D/g, "");
                              const value = Number(raw) / 100;
                              if (!isNaN(value) && value > 0) {
                                updateGoalProgress(goal.id, value);
                                setTargetAmount("");
                              }
                            }}
                            className="flex gap-2 items-center"
                          >
                            <div className="relative w-full sm:w-48">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-sm pointer-events-none">
                                R$
                              </span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={targetAmount}
                                placeholder="0,00"
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/\D/g, "");
                                  const value = Number(raw) / 100;

                                  if (isNaN(value)) {
                                    setTargetAmount("");
                                  } else {
                                    const formatted = value.toLocaleString("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    });
                                    setTargetAmount(formatted);
                                  }
                                }}
                                required
                                className="w-full bg-gray-800/80 border border-purple-900/30 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 text-white text-sm"
                              />
                            </div>
                            <button
                              type="submit"
                              className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                              Adicionar
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.header>
          </>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/30 rounded-xl p-6 shadow-xl animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                      {editingGoal ? "Editar Meta" : "Nova Meta"}
                    </span>
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    aria-label="Fechar formulário"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm text-gray-400 mb-1">
                        Título da Meta
                      </label>
                      <input
                        id="title"
                        type="text"
                        placeholder="Ex: Fundo de emergência"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full bg-gray-800/80 border border-purple-900/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="targetAmount"
                        className="block text-sm text-gray-400 mb-1"
                      >
                        Valor da Meta
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <input
                          id="targetAmount"
                          type="text"
                          placeholder="R$ 0,00"
                          value={displayAmount}
                          onChange={handleCurrencyChange}
                          required
                          className="w-full bg-gray-800/80 border border-purple-900/30 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="deadline"
                        className="block text-sm text-gray-400 mb-1"
                      >
                        Prazo
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <input
                          id="deadline"
                          type="date"
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          required
                          className="w-full bg-gray-800/80 border border-purple-900/30 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-5 py-2.5 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-2.5 rounded-lg transition-all duration-300 shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full animate-shimmer"></div>
                      <span className="relative z-10">
                        {isSubmitting
                          ? "Salvando..."
                          : editingGoal
                          ? "Atualizar Meta"
                          : "Criar Meta"}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
