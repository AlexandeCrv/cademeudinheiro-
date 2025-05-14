import axios from "axios";

let cachedFinanceData = null;
let lastFetchTime = 0;
let currentIndex = 0;
let rateLimitedUntil = 0;

export const getFinanceSummary = async (req, res) => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  if (now < rateLimitedUntil) {
    return res
      .status(429)
      .json({ message: "Atingido limite de chamadas por hora, aguarde..." });
  }

  if (!cachedFinanceData || now - lastFetchTime > oneHour) {
    try {
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ message: "Chave de API não configurada" });
      }

      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`
      );

      if (!response.data || !response.data.top_gainers || !response.data.top_losers) {
        return res.status(500).json({ message: "Dados inválidos da API" });
      }

      cachedFinanceData = {
        top: response.data.top_gainers.slice(0, 5),
        bottom: response.data.top_losers.slice(0, 5),
      };

      lastFetchTime = now;
      currentIndex = 0;
    } catch (error) {
      console.error("Erro ao buscar dados financeiros:", error.message);
      rateLimitedUntil = now + oneHour;
      return res
        .status(500)
        .json({ message: "Erro ao buscar dados financeiros", error: error.message });
    }
  }

  const rotatingData = {
    top: [cachedFinanceData.top[currentIndex % cachedFinanceData.top.length]],
    bottom: [cachedFinanceData.bottom[currentIndex % cachedFinanceData.bottom.length]],
  };

  currentIndex++;

  res.json(rotatingData);
};
