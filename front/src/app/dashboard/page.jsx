"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ResumoCards from "./ResumoCards";
import TransactionControls from "./TransactionControls";
import TransactionsList from "./TransactionsList";
import ModalTransacao from "./ModalTransacao";
import ProfileModal from "./ProfileModal";
import { Settings, User } from "lucide-react";
import Sidebar from "./sidebar";

export default function Dashboard() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [role, setRole] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("entrada");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [observacao, setObservacao] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [periodFilter, setPeriodFilter] = useState("all");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const resetForm = () => {
    setTitle("");
    setAmount("");
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setCategory("");
    setObservacao("");
    setTransactionToEdit(null);
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  function openTransactionModal(transactionOrType) {
    // Se for uma string, é apenas o tipo (nova transação)
    if (typeof transactionOrType === "string") {
      setTransactionToEdit(null);
      setType(transactionOrType);
      setTitle("");
      setAmount("");
      setObservacao("");
      setSelectedDate(new Date().toISOString().split("T")[0]);

      // Define uma categoria padrão com base no tipo
      if (transactionOrType === "entrada") {
        setCategory("salario"); // Categoria padrão para entrada
      } else {
        setCategory("outros_saida"); // Categoria padrão para saída
      }
    }
    // Se for um objeto, é uma transação existente (edição)
    else {
      const transaction = transactionOrType;
      setTransactionToEdit(transaction);
      setTitle(transaction.title);

      // Formata o valor monetário corretamente para exibição no input
      let amountValue = transaction.amount;
      if (typeof amountValue === "object" && amountValue.$numberDecimal) {
        amountValue = Number.parseFloat(amountValue.$numberDecimal);
      }

      // Converte para string formatada em reais (sem o símbolo R$)
      const formattedAmount = amountValue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      setAmount(formattedAmount);
      setType(transaction.type);
      setCategory(transaction.category);
      setObservacao(transaction.observacao || "");
      setSelectedDate(transaction.createdAt.split("T")[0]);
    }

    setIsModalOpen(true);
  }

  const handleEdit = (transaction) => {
    openTransactionModal(transaction);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const numericValue = Number.parseFloat(String(amount).replace(/\D/g, "")) / 100;

    const transactionData = {
      title,
      amount: numericValue,
      type,
      category,
      observacao,
      createdAt: selectedDate,
    };

    const isEditing = transactionToEdit !== null;
    const url = isEditing
      ? `${BASE_URL}/transactions/${transactionToEdit._id}`
      : `${BASE_URL}/transactions`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });

      if (!res.ok) {
        throw new Error(`Erro ao ${isEditing ? "atualizar" : "criar"} transação`);
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        fetchData();
      }, 1500);
    } catch (err) {
      setError(`Erro ao ${isEditing ? "atualizar" : "adicionar"} transação`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData();
  }, []);

  useEffect(() => {
    // When period filter changes, fetch data with the new filter
    if (token) {
      fetchData();
    }
  }, [periodFilter]);

  useEffect(() => {
    // Filtrar transações com base nos filtros ativos
    let filtered = [...transactions];

    // Filtro por tipo
    if (activeFilter !== "all") {
      filtered = filtered.filter((t) => t.type === activeFilter);
    }

    // Filtro por data
    if (dateRange !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter((t) => {
        const transDate = new Date(t.createdAt);

        if (dateRange === "today") {
          return transDate >= today;
        } else if (dateRange === "week") {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return transDate >= weekAgo;
        } else if (dateRange === "month") {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return transDate >= monthAgo;
        }
        return true;
      });
    }

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, activeFilter, dateRange, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoints = [
        `${BASE_URL}/transactions`,
        `${BASE_URL}/transactions/summary`,
        `${BASE_URL}/profile`,
      ];

      const [transactionsRes, summaryRes, profileRes] = await Promise.all(
        endpoints.map((url) =>
          fetch(url, { headers: { Authorization: `Bearer ${token}` } })
        )
      );

      const [transactions, summary, profile] = await Promise.all([
        transactionsRes.json(),
        summaryRes.json(),
        profileRes.json(),
      ]);

      setTransactions(transactions);
      setFilteredTransactions(transactions);
      setResumo(summary);
      setUserName(profile.name || "Usuário");
      setUserProfile(profile);
      setRole(profile.role);
    } catch (err) {
      setError("Erro ao carregar dados.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setUserName(updatedProfile.name);
    setUserProfile(updatedProfile);
  };

  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    } finally {
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao deletar transação");

      fetchData();
    } catch (err) {
      setError("Erro ao deletar transação");
      console.error(err);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "R$ 0,00";

    if (typeof value === "object" && value.$numberDecimal) {
      value = Number.parseFloat(value.$numberDecimal);
    }

    const parsedValue = typeof value === "number" ? value : Number.parseFloat(value);

    if (isNaN(parsedValue)) {
      return "R$ 0,00";
    }

    return parsedValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="min-h-screen bg-gray-950 relative text-white overflow-y-clip overflow-x-clip">
      {/* Sidebar */}
      <Sidebar userName={userName} role={role} onLogout={handleLogout} />
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
          className="flex justify-between items-center mb-8 pb-4 border-b border-purple-900/30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
              Dashboard Financeiro
            </h1>
            <p className="text-gray-400">Acompanhe suas finanças em tempo real</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center  relative  z-10gap-4">
              <div
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-full border border-purple-900/30 cursor-pointer hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center overflow-hidden">
                  {userProfile?.profilePhoto ? (
                    <img
                      src={`${BASE_URL}${userProfile.profilePhoto}`}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-purple-300" />
                  )}
                </div>
                <span className="text-sm text-purple-300">{userName}</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Resumo */}
        {resumo && (
          <ResumoCards
            resumo={resumo}
            openTransactionModal={openTransactionModal}
            token={token}
          />
        )}

        {/* Ações e Filtros */}
        <TransactionControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          transactions={transactions}
        />

        {/* Modal de Nova Transação */}
        {isModalOpen && (
          <ModalTransacao
            isModalOpen={isModalOpen}
            resetForm={resetForm}
            onClose={() => setIsModalOpen(false)}
            type={type}
            showSuccess={showSuccess}
            handleSubmit={handleSubmit}
            title={title}
            setTitle={setTitle}
            amount={amount}
            setAmount={setAmount}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            isSubmitting={isSubmitting}
            category={category}
            setCategory={setCategory}
            observacao={observacao}
            setObservacao={setObservacao}
            transactionToEdit={transactionToEdit}
          />
        )}

        {/* Modal de Perfil */}
        {isProfileModalOpen && (
          <ProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            userData={userProfile}
            onUpdate={handleProfileUpdate}
          />
        )}

        {/* Transações */}
        <TransactionsList
          loading={loading}
          error={error}
          filteredTransactions={filteredTransactions}
          transactions={transactions}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleDelete={handleDelete}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          formatTime={formatTime}
          onEdit={handleEdit}
          observacao={observacao}
          setObservacao={setObservacao}
        />
      </div>
    </div>
  );
}
