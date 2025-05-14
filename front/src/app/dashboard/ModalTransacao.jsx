"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Check,
  DollarSign,
  Tag,
  X,
  Briefcase,
  TrendingUp,
  Banknote,
  Gift,
  Wallet,
  Landmark,
  Home,
  Utensils,
  Car,
  Heart,
  GraduationCap,
  ShoppingCart,
  Plane,
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle,
  ChevronDown,
} from "lucide-react";

const ENTRADA_CATEGORIES = [
  { id: "salario", name: "Salário", icon: Briefcase },
  { id: "investimentos", name: "Investimentos", icon: TrendingUp },
  { id: "emprestimos", name: "Empréstimos", icon: Banknote },
  { id: "presente", name: "Presente", icon: Gift },
  { id: "bonus", name: "Bônus", icon: Wallet },
  { id: "outros_entrada", name: "Outros", icon: Landmark },
];

const SAIDA_CATEGORIES = [
  { id: "moradia", name: "Moradia", icon: Home },
  { id: "alimentacao", name: "Alimentação", icon: Utensils },
  { id: "transporte", name: "Transporte", icon: Car },
  { id: "saude", name: "Saúde", icon: Heart },
  { id: "educacao", name: "Educação", icon: GraduationCap },
  { id: "mercado", name: "Mercado", icon: ShoppingCart },
  { id: "lazer", name: "Lazer", icon: Plane },
  { id: "cartao", name: "Cartão de Crédito", icon: CreditCard },
  { id: "emprestimos", name: "Empréstimos", icon: Banknote },
  { id: "outros_saida", name: "Outros", icon: Wallet },
];

export default function ModalTransacao({
  isModalOpen,
  resetForm,
  type,
  showSuccess,
  handleSubmit,
  title,
  setTitle,
  amount,
  setAmount,
  selectedDate,
  setSelectedDate,
  isSubmitting,
  onClose,
  category,
  setCategory,
  setObservacao,
  observacao,
}) {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const categories = type === "entrada" ? ENTRADA_CATEGORIES : SAIDA_CATEGORIES;

  useEffect(() => {
    if (!isModalOpen) {
      setTimeout(() => {
        setIsCategoryDropdownOpen(false);
      }, 300);
    }
  }, [isModalOpen]);

  const selectedCategory = categories.find((cat) => cat.id === category);

  const getColorClasses = () => {
    if (type === "entrada") {
      return {
        bg: "bg-green-500/20",
        border: "border-green-500/50",
        text: "text-green-400",
        button: "from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
        shadow: "shadow-green-900/30 hover:shadow-green-900/50",
        ring: "focus:ring-green-500",
        icon: <ArrowUpCircle className="h-6 w-6 text-green-500" />,
      };
    } else {
      return {
        bg: "bg-red-500/20",
        border: "border-red-500/50",
        text: "text-red-400",
        button: "from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
        shadow: "shadow-red-900/30 hover:shadow-red-900/50",
        ring: "focus:ring-red-500",
        icon: <ArrowDownCircle className="h-6 w-6 text-red-500" />,
      };
    }
  };

  const colors = getColorClasses();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md">
        <div
          className={`absolute inset-0 ${colors.bg} rounded-2xl blur-xl opacity-50`}
        ></div>

        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/30 rounded-xl shadow-xl overflow-hidden">
          <div className={`p-6 ${colors.bg} border-b ${colors.border}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center`}
                >
                  {colors.icon}
                </div>
                <h2 className={`text-xl font-bold ${colors.text}`}>
                  {type === "entrada" ? "Nova Entrada" : "Nova Saída"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {showSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 animate-fadeIn">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-400" />
                </div>
                <p className="text-green-400 font-medium text-lg">
                  Transação adicionada com sucesso!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Tag className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Título da transação"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={`w-full bg-gray-800/80 border border-purple-900/30 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 ${colors.ring} focus:border-transparent placeholder-gray-500 text-white`}
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="R$ 0,00"
                    value={amount}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, ""); // remove tudo que não é número
                      const value = Number(raw) / 100;

                      if (isNaN(value)) {
                        setAmount("");
                      } else {
                        const formatted = value.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        });
                        setAmount(formatted);
                      }
                    }}
                    required
                    className={`w-full bg-gray-800/80 border border-purple-900/30 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 ${colors.ring} focus:border-transparent placeholder-gray-500 text-white`}
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm text-gray-400 mb-1">Categoria</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                      className={`w-full flex items-center justify-between bg-gray-800/80 border border-purple-900/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${colors.ring} focus:border-transparent text-white`}
                    >
                      <div className="flex items-center gap-2">
                        {selectedCategory && (
                          <>
                            <div className={`p-1.5 rounded-md ${colors.bg}`}>
                              <selectedCategory.icon className="h-4 w-4" />
                            </div>
                            <span>{selectedCategory.name}</span>
                          </>
                        )}
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isCategoryDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isCategoryDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-purple-900/30 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setCategory(cat.id);
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700 text-left ${
                              category === cat.id
                                ? `${colors.bg} ${colors.text}`
                                : "text-white"
                            }`}
                          >
                            <div className={`p-1.5 rounded-md ${colors.bg}`}>
                              <cat.icon className="h-4 w-4" />
                            </div>
                            <span>{cat.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative mt-4">
                  <label className="block text-sm text-gray-400 mb-1">
                    Observação (opcional).
                  </label>
                  <textarea
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    rows={3}
                    placeholder="Adicione um comentário ou observação..."
                    className="w-full bg-gray-800/80 border border-purple-900/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-white resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`relative overflow-hidden bg-gradient-to-r ${colors.button} text-white px-5 py-2.5 rounded-lg shadow-md ${colors.shadow} transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
