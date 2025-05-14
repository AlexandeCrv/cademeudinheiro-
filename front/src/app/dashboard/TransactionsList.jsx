// components/TransactionsList.jsx

import { useState, useEffect } from "react";

import { ArrowDownCircle, ArrowUpCircle, Trash2 } from "lucide-react";

import { categoryMap } from "./utils/categoryIcons";

import { MessageSquare } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const TransactionsList = ({
  loading,

  error,

  filteredTransactions,

  transactions,

  searchTerm,

  setSearchTerm,

  handleDelete,

  formatCurrency,

  formatDate,

  onEdit,

  formatTime,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const handleEdit = (transaction) => {
    setTransactionToEdit(transaction); // Aqui você pode abrir o modal para edição
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentTransactions = filteredTransactions.slice(
    startIndex,

    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1); // resetar para a primeira página ao filtrar
  }, [filteredTransactions]);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/50 rounded-xl p-6 shadow-xl animate-fadeIn">
      <h2 className="text-xl font-bold mb-6 text-white">Transações Recentes</h2> {" "}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          {" "}
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />{" "}
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 text-red-400 animate-fadeIn">
          {error} {" "}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12 animate-fadeIn">
          <p className="text-gray-500">Nenhuma transação encontrada</p>{" "}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              Limpar busca{" "}
            </button>
          )}{" "}
        </div>
      ) : (
        <>
          {" "}
          <div className="hidden md:grid grid-cols-7 gap-4 mb-4 text-sm text-gray-500 border-b border-gray-800 pb-2 animate-fadeIn">
            <div>Título</div> <div>Valor</div> <div>Tipo</div> <div>Data</div>{" "}
            <div>Categoria</div> {/* NOVO */} <div>Comentário</div> {/* NOVO */}{" "}
          </div>{" "}
          <ul className="space-y-3 animate-fadeIn">
            {" "}
            {currentTransactions.map((t) => {
              const Icon = categoryMap[t.category]?.icon;

              return (
                <li
                  key={t._id}
                  className="bg-gray-800/60 border border-gray-700/40 hover:border-purple-800/60 rounded-lg p-4 transition-all duration-200 shadow-md hover:shadow-purple-900/10"
                  onClick={() => onEdit(t)}
                >
                  {" "}
                  <div className="grid gap-2 md:grid-cols-7 md:gap-4 md:items-center">
                    {/* Título */} <div className="font-medium text-white">{t.title}</div>
                    {/* Valor */}{" "}
                    <div
                      className={`text-sm ${
                        t.type === "entrada" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {formatCurrency(t.amount)}{" "}
                    </div>
                    {/* Tipo */}{" "}
                    <div>
                      {" "}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          t.type === "entrada"
                            ? "bg-green-900/20 text-green-400 border border-green-900/30"
                            : "bg-red-900/20 text-red-400 border border-red-900/30"
                        }`}
                      >
                        {" "}
                        {t.type === "entrada" ? (
                          <ArrowUpCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownCircle className="h-3 w-3 mr-1" />
                        )}{" "}
                        {t.type === "entrada" ? "Entrada" : "Saída"}{" "}
                      </span>{" "}
                    </div>
                    {/* Data e hora */}{" "}
                    <div className="text-xs text-gray-400 flex flex-col md:flex-row md:gap-2">
                      <span>{formatDate(t.createdAt)}</span> {" "}
                      <span className="hidden md:inline text-gray-600">•</span>
                      <span>{formatTime(t.createdAt)}</span>{" "}
                    </div>
                    {/* Categoria */}{" "}
                    <div className="text-sm text-purple-300 flex items-center gap-2">
                      {Icon && <Icon className="w-4 h-4" />} 
                      {categoryMap[t.category]?.name || "Sem categoria"} {" "}
                    </div>
                    {/* Observação */}{" "}
                    <div>
                      {" "}
                      {t.observacao && (
                        <div className="relative group ml-2">
                          {" "}
                          <MessageSquare className="h-4 w-4 text-purple-400 hover:text-purple-300 cursor-pointer" />{" "}
                          <div className="absolute z-10 left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1 rounded-md shadow-lg max-w-xs whitespace-pre-wrap">
                            {t.observacao}{" "}
                          </div>{" "}
                        </div>
                      )}{" "}
                    </div>
                    {/* Botão Excluir */}{" "}
                    <div className="flex justify-end">
                      {" "}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          handleDelete(t._id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        aria-label="Excluir transação"
                      >
                        <Trash2 className="h-5 w-5" />{" "}
                      </button>{" "}
                    </div>{" "}
                  </div>{" "}
                </li>
              );
            })}{" "}
          </ul>{" "}
          <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
            {" "}
            <p>
              Mostrando {currentTransactions.length} de {filteredTransactions.length}{" "}
              transações{" "}
            </p>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded transition-colors ${
                  currentPage === 1
                    ? "border-gray-700 text-gray-600 cursor-not-allowed"
                    : "border-gray-800 hover:border-purple-900/30 hover:text-purple-400"
                }`}
              >
                Anterior{" "}
              </button>{" "}
              <span className="px-3 py-1 bg-purple-600/20 border border-purple-900/30 rounded text-purple-400">
                {currentPage}{" "}
              </span>{" "}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded transition-colors ${
                  currentPage === totalPages
                    ? "border-gray-700 text-gray-600 cursor-not-allowed"
                    : "border-gray-800 hover:border-purple-900/30 hover:text-purple-400"
                }`}
              >
                Próxima{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </>
      )}{" "}
    </div>
  );
};

export default TransactionsList;
