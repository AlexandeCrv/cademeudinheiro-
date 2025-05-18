"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { Calendar, Info } from "lucide-react";

export default function ForecastChart({ historicalData, forecastData }) {
  const [showInfo, setShowInfo] = useState(false);
  const [timeRange, setTimeRange] = useState("6m");

  const combinedData = [...historicalData, ...forecastData];

  const filteredData = () => {
    const now = new Date();
    let monthsToShow = 6;

    switch (timeRange) {
      case "3m":
        monthsToShow = 3;
        break;
      case "6m":
        monthsToShow = 6;
        break;
      case "1y":
        monthsToShow = 12;
        break;
      default:
        monthsToShow = 6;
    }

    return combinedData.slice(-monthsToShow - 3);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const forecastStartIndex = historicalData.length;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const isForecast =
        combinedData.findIndex((item) => item.month === label) >= forecastStartIndex;

      return (
        <div className="bg-gray-800 p-3 rounded border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-sm font-medium text-white">{label}</p>
            {isForecast && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-900/50 text-blue-300">
                Previsão
              </span>
            )}
          </div>

          {payload.map((entry, index) => (
            <p
              key={`item-${index}`}
              className="text-xs flex justify-between gap-4"
              style={{ color: entry.color }}
            >
              <span>{entry.name}:</span>
              <span className="font-medium">{formatCurrency(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLegend = (props) => {
    const { payload } = props;

    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center gap-1 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-300">{entry.value}</span>
          </li>
        ))}
        <li className="flex items-center gap-1 text-xs">
          <div className="w-3 h-0.5 border-t-2 border-dashed border-white/50" />
          <span className="text-gray-300">Início da Previsão</span>
        </li>
      </ul>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium text-gray-200">
            Previsão de Gastos e Receitas
          </h3>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-gray-400 hover:text-gray-300"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center text-xs text-gray-400 mr-2">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Período:</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setTimeRange("3m")}
              className={`px-2 py-1 rounded text-xs ${
                timeRange === "3m"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-purple-400"
              }`}
            >
              3M
            </button>
            <button
              onClick={() => setTimeRange("6m")}
              className={`px-2 py-1 rounded text-xs ${
                timeRange === "6m"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-purple-400"
              }`}
            >
              6M
            </button>
            <button
              onClick={() => setTimeRange("1y")}
              className={`px-2 py-1 rounded text-xs ${
                timeRange === "1y"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-purple-400"
              }`}
            >
              1A
            </button>
          </div>
        </div>
      </div>

      {showInfo && (
        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-900/30 rounded-lg text-xs text-blue-300">
          <p>
            Esta previsão é baseada nos seus padrões históricos de gastos e receitas,
            ajustada para tendências sazonais e inflação.
          </p>
        </div>
      )}

      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData()}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#9CA3AF" }}
              axisLine={{ stroke: "#4B5563" }}
            />
            <YAxis
              tick={{ fill: "#9CA3AF" }}
              axisLine={{ stroke: "#4B5563" }}
              tickFormatter={(value) => `R$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderCustomizedLegend} />

            <ReferenceLine
              x={historicalData[historicalData.length - 1]?.month}
              stroke="#ffffff"
              strokeDasharray="3 3"
              strokeWidth={2}
              opacity={0.5}
            />

            <Area
              type="monotone"
              dataKey="income"
              name="Receitas"
              stroke="#10B981"
              fill="#10B98133"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Despesas"
              stroke="#EF4444"
              fill="#EF444433"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="savings"
              name="Economia"
              stroke="#8B5CF6"
              fill="#8B5CF633"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
