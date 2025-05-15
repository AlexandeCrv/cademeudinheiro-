// controller/aiController.js
import axios from "axios";
import { Transaction } from "../models/Transaction.js";
import { Goal } from "../models/Goal.js";
import { User } from "../models/User.js";

export const getInsightFromAI = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user.id;

  if (!prompt) {
    return res.status(400).json({ message: "Prompt é obrigatório" });
  }

  try {
    // Dados do usuário
    const [transactions, goals, userData] = await Promise.all([
      Transaction.find({ user: userId }),
      Goal.find({ user: userId }),
      User.findOne({ _id: userId }), // 🛠 Corrigido: _id é o campo correto
    ]);

    // Formatando transações
    const transactionsSummary = transactions
      .map(
        (t) =>
          `R$${Number(t.amount).toFixed(2)} ${t.type} em ${new Date(
            t.createdAt
          ).toLocaleDateString()}`
      )
      .join(", ");

    // Formatando metas
    const goalsSummary = goals
      .map(
        (g) =>
          `${g.title}: objetivo de R$${Number(g.amount).toFixed(
            2
          )}, atualmente com R$${Number(g.current).toFixed(2)}`
      )
      .join("; ");

    // Formatando perfil (se existir)
    const UserSummary = userData
      ? `Nome: ${userData.name}, bio: ${userData.bio}, gênero: ${userData.gender}, foto: ${userData.profilePhoto}`
      : "Perfil não cadastrado";

    // Criando o prompt final
    const combinedPrompt = `${prompt}

📌 Dados do usuário para análise:
- 👤 Perfil: ${UserSummary}
- 💳 Transações: ${transactionsSummary || "Sem transações registradas"}
- 🎯 Metas financeiras: ${goalsSummary || "Nenhuma meta registrada"}

Com base nessas informações, forneça uma análise ou sugestão personalizada com linguagem clara, objetiva e acessível, em no máximo 10 linhas.

• Não use asteriscos para negrito ou formatação.
• Prefira emojis, quebras de linha ou bullets simples (como "•") para organizar os pontos.
• Evite repetir informações já apresentadas no resumo acima.
`;
    // Chamada à API da Gemini
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: combinedPrompt }],
          },
        ],
      }
    );

    const text =
      response.data.candidates[0]?.content?.parts[0]?.text ||
      "Não foi possível gerar uma resposta";

    res.status(200).json({ result: text });
  } catch (error) {
    console.error("Erro ao consultar IA:", error.response?.data || error.message);
    res.status(500).json({ message: "Erro ao gerar resposta da IA" });
  }
};
