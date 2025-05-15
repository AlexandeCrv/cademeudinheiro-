"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { PieChart, Pie, Sector } from "recharts";
import { PieChartIcon, BarChartIcon } from "lucide-react";

export default function SpendingBreakdownChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartType, setChartType] = useState("pie");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Colors for the chart segments
  const COLORS = [
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#F59E0B", // Amber
    "#10B981", // Green
    "#3B82F6", // Blue
    "#6366F1", // Indigo
    "#D946EF", // Fuchsia
    "#F97316", // Orange
    "#14B8A6", // Teal
    "#A855F7", // Purple
    "#F43F5E", // Rose
  ];

  // Format currency for tooltip
  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Filter data based on selected category
  const filteredData =
    categoryFilter === "all"
      ? data
      : data.filter((item) => {
          if (categoryFilter === "essential") {
            return ["moradia", "alimentacao", "saude", "transporte", "educacao"].includes(
              item.categoryKey
            );
          } else if (categoryFilter === "non-essential") {
            return ![
              "moradia",
              "alimentacao",
              "saude",
              "transporte",
              "educacao",
            ].includes(item.categoryKey);
          }
          return true;
        });

  // Calculate percentages for each category
  const total = filteredData.reduce((sum, entry) => sum + entry.value, 0);
  const dataWithPercent = filteredData.map((entry) => ({
    ...entry,
    percent: entry.value / total,
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded border border-gray-700 shadow-lg">
          <p className="text-sm font-medium text-white mb-1">{payload[0].name}</p>
          <p className="text-xs text-gray-300">{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-purple-400">{`${(
            payload[0].payload.percent * 100
          ).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom active shape for pie chart
  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    return (
      <g>
        <text
          x={cx}
          y={cy - 20}
          dy={8}
          textAnchor="middle"
          fill="#fff"
          className="text-sm"
        >
          {payload.category}
        </text>
        <text
          x={cx}
          y={cy + 10}
          dy={8}
          textAnchor="middle"
          fill="#fff"
          className="text-lg font-medium"
        >
          {formatCurrency(value)}
        </text>
        <text
          x={cx}
          y={cy + 30}
          dy={8}
          textAnchor="middle"
          fill="#8B5CF6"
          className="text-xs"
        >
          {`${(percent * 100).toFixed(1)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 5}
          outerRadius={innerRadius - 2}
          fill={fill}
        />
      </g>
    );
  };

  // Custom legend
  const renderCustomizedLegend = (props) => {
    const { payload } = props;

    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {payload.map((entry, index) => (
          <li
            key={`item-${index}`}
            className="flex items-center gap-1 text-xs cursor-pointer"
            onClick={() => setActiveIndex(index)}
          >
            <div
              className={`w-3 h-3 rounded-full transition-all ${
                activeIndex === index ? "w-4 h-4" : ""
              }`}
              style={{ backgroundColor: entry.color }}
            />
            <span
              className={`text-gray-300 ${activeIndex === index ? "font-medium" : ""}`}
            >
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-200">Distribuição de Gastos</h3>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-2 py-1 rounded text-xs ${
                categoryFilter === "all"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-purple-400"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setCategoryFilter("essential")}
              className={`px-2 py-1 rounded text-xs ${
                categoryFilter === "essential"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-purple-400"
              }`}
            >
              Essenciais
            </button>
            <button
              onClick={() => setCategoryFilter("non-essential")}
              className={`px-2 py-1 rounded text-xs ${
                categoryFilter === "non-essential"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-purple-400"
              }`}
            >
              Não Essenciais
            </button>
          </div>

          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setChartType("pie")}
              className={`p-1 rounded ${
                chartType === "pie"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-purple-400"
              }`}
            >
              <PieChartIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`p-1 rounded ${
                chartType === "bar"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-purple-400"
              }`}
            >
              <BarChartIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "pie" ? (
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={dataWithPercent}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                nameKey="category"
                onMouseEnter={onPieEnter}
              >
                {dataWithPercent.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend content={renderCustomizedLegend} />
            </PieChart>
          ) : (
            <BarChart
              data={dataWithPercent.sort((a, b) => b.value - a.value)}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 80,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#9CA3AF" }}
                axisLine={{ stroke: "#4B5563" }}
                tickFormatter={(value) => `R$${value / 1000}k`}
              />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fill: "#9CA3AF" }}
                axisLine={{ stroke: "#4B5563" }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" nameKey="category">
                {dataWithPercent.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
