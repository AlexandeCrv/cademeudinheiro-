"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function PieChart({ data, height = 300, options = {} }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destruir o gráfico anterior se existir
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Configurações padrão
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: "#d1d5db", // text-gray-300
            font: {
              size: 12,
            },
            padding: 20,
            boxWidth: 12,
            boxHeight: 12,
          },
        },
        tooltip: {
          backgroundColor: "rgba(17, 24, 39, 0.8)", // bg-gray-900 com opacidade
          titleColor: "#f3f4f6", // text-gray-100
          bodyColor: "#d1d5db", // text-gray-300
          borderColor: "rgba(139, 92, 246, 0.3)", // border-purple-500 com opacidade
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: function () {
              const label = context.label || "";
              const value = context.raw;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);

              const percentage = ((value / total) * 100).toFixed(1);
              const formattedValue = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(value);
              return `${label}: ${formattedValue} (${percentage}%)`;
            },
          },
        },
      },
    };

    // Criar o novo gráfico
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: data,
      options: { ...defaultOptions, ...options },
    });

    // Limpar ao desmontar
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options]);

  return <canvas ref={chartRef} height={height} />;
}
