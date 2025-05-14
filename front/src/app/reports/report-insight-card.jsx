"use client";

import { ChevronDown } from "lucide-react";

export default function ReportInsightCard({ insight, isExpanded, onToggle }) {
  const { title, description, icon: Icon, color, details } = insight;

  const getColorClasses = (color) => {
    switch (color) {
      case "green":
        return "bg-green-900/20 border-green-900/50 text-green-400";
      case "red":
        return "bg-red-900/20 border-red-900/50 text-red-400";
      case "amber":
        return "bg-amber-900/20 border-amber-900/50 text-amber-400";
      default:
        return "bg-purple-900/20 border-purple-900/50 text-purple-400";
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className={`border rounded-lg p-5 transition-all ${colorClasses}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${
              color === "green"
                ? "bg-green-900/30"
                : color === "red"
                ? "bg-red-900/30"
                : color === "amber"
                ? "bg-amber-900/30"
                : "bg-purple-900/30"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-white">{title}</h3>
            <p className="text-sm opacity-90">{description}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`p-1 rounded-full hover:bg-white/10 transition-colors ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-sm opacity-80">{details}</p>
        </div>
      )}
    </div>
  );
}
