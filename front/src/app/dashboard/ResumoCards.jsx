"use client";

import {
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Bell,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mini chart component to visualize stock movement
const MiniChart = ({ data, isPositive }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Ajusta a resolução interna do canvas
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Escala o contexto para lidar com a densidade de pixels
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Generate some random data if real data isn't provided
    const points =
      data ||
      Array(10)
        .fill(0)
        .map(() => Math.random() * height);

    // Calculate step size
    const step = width / (points.length - 1);

    // Draw line
    ctx.beginPath();
    ctx.moveTo(0, height - points[0]);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(i * step, height - points[i]);
    }

    // Style based on trend
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (isPositive) {
      gradient.addColorStop(0, "rgba(34, 197, 94, 0.5)");
      gradient.addColorStop(1, "rgba(34, 197, 94, 0)");
      ctx.strokeStyle = "#22c55e";
    } else {
      gradient.addColorStop(0, "rgba(239, 68, 68, 0.5)");
      gradient.addColorStop(1, "rgba(239, 68, 68, 0)");
      ctx.strokeStyle = "#ef4444";
    }

    ctx.lineWidth = 2;
    ctx.stroke();

    // Fill area under the line
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  }, [data, isPositive]);

  return <canvas ref={canvasRef} width={100} height={40} className="w-full h-10" />;
};

const Loader = () => (
  <div className="flex items-center justify-center h-10">
    <div className="w-6 h-6 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
  </div>
);

// Stock ticker component with pin indicators
const StockTicker = ({ stock, isGainer }) => {
  if (!stock) return null;

  // Corrigir a extração e formatação do percentual de mudança
  const changeValue = Number.parseFloat(String(stock.change_percent).replace("%", "")); // Remover % e converter para número
  const absoluteChange = Math.abs(changeValue).toFixed(2); // Valor absoluto da mudança percentual
  const changeAmount = Number.parseFloat(stock.change_amount).toFixed(2); // Valor da mudança em unidades monetárias
  const changePercent = isGainer
    ? `+${changeValue.toFixed(2)}%` // Para os "gainers", exibe o percentual positivo
    : `-${changeValue.toFixed(2)}%`; // Para os "losers", exibe o percentual negativo
  const price = Number.parseFloat(stock.price).toFixed(2); // Preço atual da ação

  return (
    <motion.div
      key={stock.ticker + stock.price} // isso força o re-render e animação ao mudar de ação
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between w-full overflow-hidden group"
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-8 ${
            isGainer ? "bg-green-500" : "bg-red-500"
          } rounded-full relative`}
        >
          {/* Pin effect */}
          <div
            className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 ${
              isGainer ? "bg-green-400" : "bg-red-400"
            } rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity`}
          ></div>
        </div>
        <div className="p-1">
          <div className="font-bold text-base">{stock.ticker}</div>
          <div className="font-light text-sm"> $ {price}</div>
          <div className="text-xs text-gray-400"></div>
        </div>
      </div>

      <div className="flex flex-col items-end text-xs text-right">
        <div
          className={`font-bold text-sm ${isGainer ? "text-green-400" : "text-red-400"}`}
        >
          {isGainer ? "+" : ""}
          {stock.change_percentage}
        </div>
        <div className="flex items-center">
          {isGainer ? (
            <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
          )}
          <span className={isGainer ? "text-green-400" : "text-red-400"}>
            {isGainer ? "Subindo" : "Caindo"}
          </span>
        </div>
        <span className={isGainer ? "text-green-400" : "text-red-400"}>
          <div className="">Mudança de ${changeAmount}</div>
        </span>
      </div>
    </motion.div>
  );
};

// Componente de ação rápida
const QuickActionButton = ({
  icon: Icon,
  label,
  onClick,
  color,
  hoverColor,
  shadowColor,
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`group relative overflow-hidden bg-gradient-to-r ${color} ${hoverColor} mr-[10px] text-white px-2 w-[150px] py-4 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg ${shadowColor}`}
  >
    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    <div className="relative z-10 flex items-center gap-3 w-full">
      <div className="bg-white/20 rounded-full p-2">
        <Icon className="h-5 w-5" />
      </div>
      <span className="font-medium">{label}</span>
    </div>
  </motion.button>
);

export default function ResumoCards({ resumo, openTransactionModal, token }) {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [gainIndex, setGainIndex] = useState(0);
  const [loseIndex, setLoseIndex] = useState(0);
  const [chartData, setChartData] = useState({
    gainers: Array(10)
      .fill(0)
      .map(() => Math.random() * 40),
    losers: Array(10)
      .fill(0)
      .map(() => Math.random() * 40),
  });
  const [activeTab, setActiveTab] = useState("transacoes");
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!token) return; // evita rodar enquanto o token não estiver pronto

    async function fetchMarketData() {
      try {
        const res = await fetch(`${BASE_URL}/api/finances`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("API RESPONSE", data);

        if (data.top && data.top.length > 0) {
          setGainers(data.top || []);
        }

        if (data.bottom && data.bottom.length > 0) {
          setLosers(data.bottom || []);
        }

        setChartData({
          gainers: Array(10)
            .fill(0)
            .map(() => Math.random() * 40),
          losers: Array(10)
            .fill(0)
            .map(() => Math.random() * 40),
        });
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    }

    fetchMarketData();
    const dataInterval = setInterval(fetchMarketData, 60000);

    return () => clearInterval(dataInterval);
  }, [token]);

  useEffect(() => {
    if (gainers.length === 0 || losers.length === 0) return;

    const interval = setInterval(() => {
      setGainIndex((prev) => (prev + 1) % gainers.length);
      setLoseIndex((prev) => (prev + 1) % losers.length);

      // Update chart data for animation effect
      setChartData((prev) => ({
        gainers: [...prev.gainers.slice(1), Math.random() * 40],
        losers: [...prev.losers.slice(1), Math.random() * 40],
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [gainers.length, losers.length]);

  if (!resumo) return null;

  const formatCurrency = (value) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
      {/* Entradas - com ações em alta */}
      <div className="bg-gradient-to-br from-gray-900 h-[270px] to-gray-800 border border-purple-900/50 rounded-xl p-6 shadow-lg hover:shadow-purple-900/20 transition-shadow overflow-hidden relative group">
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent w-full h-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>

        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 mb-1">Entradas</p>
              <h3 className="text-2xl font-bold text-green-400">
                {formatCurrency(resumo.entradas)}
              </h3>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <ArrowUpCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>

          <div className="mt-4">
            {gainers.length === 0 ? (
              <Loader />
            ) : (
              <MiniChart data={chartData.gainers} isPositive={true} />
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800/50">
            <p className="text-xs text-gray-400 mb-2">Ações em Alta</p>
            <div className="h-[80px] relative">
              <AnimatePresence mode="wait">
                {gainers.length === 0 ? (
                  <Loader key="loader" />
                ) : (
                  <StockTicker
                    key={gainers[gainIndex]?.symbol}
                    stock={gainers[gainIndex]}
                    isGainer={true}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.header>
      </div>

      {/* Saídas - com ações em queda */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 border h-[270px] border-purple-900/50 rounded-xl p-6 shadow-lg hover:shadow-purple-900/20 transition-shadow overflow-hidden relative group"
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent w-full h-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 mb-1">Saídas</p>
              <h3 className="text-2xl font-bold text-red-400">
                {formatCurrency(resumo.saidas)}
              </h3>
            </div>
            <div className="p-3 bg-red-500/10 rounded-lg">
              <ArrowDownCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>

          <div className="mt-4">
            {losers.length === 0 ? (
              <Loader />
            ) : (
              <MiniChart data={chartData.losers} isPositive={false} />
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800/50">
            <p className="text-xs text-gray-400 mb-2">Ações em Baixa</p>
            <div className="h-[80px] relative">
              <AnimatePresence mode="wait">
                {losers.length === 0 ? (
                  <Loader key="loader" />
                ) : (
                  <StockTicker
                    key={losers[loseIndex]?.symbol}
                    stock={losers[loseIndex]}
                    isGainer={false}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Ações rápidas - com design aprimorado */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border h-[270px] border-purple-900/50 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-900/20 transition-shadow">
        <div className="h-full flex flex-col">
          {/* Tabs de navegação */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab("transacoes")}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === "transacoes"
                  ? "text-purple-400 border-b-2 border-purple-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Transações
            </button>
          </div>

          {/* Conteúdo das tabs */}
          <div className="p-6 flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {activeTab === "transacoes" ? (
                <motion.div
                  key="transacoes"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full"
                >
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Ações Rápidas</h3>
                    <p className="text-gray-400 text-base mb-6">
                      Adicione novas transações com facilidade.
                    </p>
                  </div>

                  <div className="space-4 mt-auto flex">
                    <QuickActionButton
                      icon={ArrowUpCircle}
                      label=" Entrada"
                      onClick={() => openTransactionModal("entrada")}
                      color="from-green-600 to-green-700"
                      hoverColor="hover:from-green-700 hover:to-green-800"
                      shadowColor="shadow-green-900/30 hover:shadow-green-900/50"
                    />

                    <QuickActionButton
                      icon={ArrowDownCircle}
                      label=" Saída"
                      onClick={() => openTransactionModal("saida")}
                      color="from-red-600 to-red-700"
                      hoverColor="hover:from-red-700 hover:to-red-800"
                      shadowColor="shadow-red-900/30 hover:shadow-red-900/50"
                    />
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">Conteúdo da aba não disponível</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
