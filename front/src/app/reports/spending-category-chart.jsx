"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function SpendingCategoryChart({ data }) {
  // Colors for the pie chart segments
  const COLORS = [
    "#8B5CF6",
    "#EC4899",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#6366F1",
    "#D946EF",
    "#F97316",
  ];

  // Format currency for tooltip
  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 rounded border border-gray-700 shadow-lg">
          <p className="text-sm font-medium text-white">{payload[0].name}</p>
          <p className="text-xs text-gray-300">{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-purple-400">{`${(
            payload[0].payload.percent * 100
          ).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Calculate percentages for each category
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const dataWithPercent = data.map((entry) => ({
    ...entry,
    percent: entry.value / total,
  }));

  // Custom legend
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
      </ul>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={dataWithPercent}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={40}
          fill="#8884d8"
          dataKey="value"
          nameKey="category"
        >
          {dataWithPercent.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderCustomizedLegend} />
      </PieChart>
    </ResponsiveContainer>
  );
}
