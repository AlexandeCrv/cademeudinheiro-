"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function LineChart({ data, height = 300, options = {} }) {
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
          position: "top",
          labels: {
            color: "#d1d5db", // text-gray-300
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(17, 24, 39, 0.8)", // bg-gray-900 com opacidade
          titleColor: "#f3f4f6", // text-gray-100
          bodyColor: "#d1d5db", // text-gray-300
          borderColor: "rgba(139, 92, 246, 0.3)", // border-purple-500 com opacidade
          borderWidth: 1,
          padding: 10,
          boxPadding: 5,
          usePointStyle: true,
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(75, 85, 99, 0.2)", // text-gray-600 com opacidade
            borderColor: "rgba(75, 85, 99, 0.5)", // text-gray-600 com opacidade
          },
          ticks: {
            color: "#9ca3af", // text-gray-400
          },
        },
        y: {
          grid: {
            color: "rgba(75, 85, 99, 0.2)", // text-gray-600 com opacidade
            borderColor: "rgba(75, 85, 99, 0.5)", // text-gray-600 com opacidade
          },
          ticks: {
            color: "#9ca3af",
            callback: function (value) {
              return "R$ " + value.toLocaleString("pt-BR");
            },
          },
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
    };

    // Criar o novo gráfico
    chartInstance.current = new Chart(ctx, {
      type: "line",
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
