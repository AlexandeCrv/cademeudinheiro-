import { Goal } from "../models/Goal.js";

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar metas" });
  }
};

export const createGoal = async (req, res) => {
  const { title, amount, deadline } = req.body;

  try {
    const newGoal = new Goal({
      title,
      amount,
      deadline,
      user: req.user._id,
    });

    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar meta" });
  }
};

export const updateGoal = async (req, res) => {
  const { id } = req.params;
  const { title, amount, current, deadline } = req.body;

  try {
    const goal = await Goal.findOne({ _id: id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ message: "Meta não encontrada" });
    }

    goal.title = title || goal.title;
    goal.amount = amount || goal.amount;
    goal.current = current ?? goal.current; // aceita 0
    goal.deadline = deadline || goal.deadline;

    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar meta" });
  }
};

export const deleteGoal = async (req, res) => {
  const { id } = req.params;

  try {
    const goal = await Goal.findOne({ _id: id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ message: "Meta não encontrada" });
    }

    await Goal.findByIdAndDelete(id);
    res.json({ message: "Meta deletada com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao deletar meta" });
  }
};
