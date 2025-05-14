import { Transaction } from "../models/Transaction.js";

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar transações" });
  }
};

export const createTransaction = async (req, res) => {
  const { title, amount, type, category, observacao } = req.body;

  try {
    const newTransaction = new Transaction({
      title,
      amount,
      type,
      createdAt: new Date(),
      category,
      observacao,
      user: req.user._id,
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar transação" });
  }
};

export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { title, amount, type, category, observacao } = req.body;

  try {
    const transaction = await Transaction.findOne({ _id: id, user: req.user._id });

    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transação não encontrada ou não pertence a você" });
    }

    transaction.title = title || transaction.title;
    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.observacao = observacao || transaction.observacao;

    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar transação" });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findOne({ _id: id, user: req.user._id });

    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transação não encontrada ou não pertence a você" });
    }

    await Transaction.findByIdAndDelete(id);
    res.json({ message: "Transação deletada com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao deletar transação" });
  }
};

export const getTransactionSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });

    // Inicializa as variáveis de entradas e saídas
    let entradas = 0;
    let saidas = 0;

    // Percorre todas as transações
    transactions.forEach((t) => {
      if (t.type === "entrada")
        entradas += parseFloat(t.amount); // Garantindo que seja tratado como número
      else if (t.type === "saida") saidas += parseFloat(t.amount); // Garantindo que seja tratado como número
    });

    // Calcula o saldo
    const saldo = entradas - saidas;

    // Retorna o resumo
    res.json({ entradas, saidas, saldo });
  } catch (error) {
    res.status(500).json({ message: "Erro ao calcular resumo" });
  }
};
// [GET] Resumo por período (com filtros ?mes=4&ano=2025)
export const getTransactionSummaryByPeriod = async (req, res) => {
  const { mes, ano } = req.query;

  if (!mes || !ano) {
    return res.status(400).json({ message: "Mês e ano são obrigatórios" });
  }

  try {
    const mesNum = parseInt(mes); // 1 a 12
    const anoNum = parseInt(ano);

    const dataInicio = new Date(anoNum, mesNum - 1, 1);
    const dataFim = new Date(anoNum, mesNum, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      user: req.user._id,
      createdAt: {
        $gte: dataInicio,
        $lte: dataFim,
      },
    });

    let entradas = 0;
    let saidas = 0;

    transactions.forEach((t) => {
      if (t.type === "entrada") entradas += parseFloat(t.amount);
      else if (t.type === "saida") saidas += parseFloat(t.amount);
    });

    const saldo = entradas - saidas;

    res.json({ entradas, saidas, saldo });
  } catch (error) {
    res.status(500).json({ message: "Erro ao calcular resumo do período" });
  }
};
