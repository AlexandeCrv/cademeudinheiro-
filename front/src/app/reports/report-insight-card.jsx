"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnhancedInsightCard({ insight, isExpanded, onToggle }) {
  const { title, description, icon: Icon, color, details, actions } = insight;

  const getColorClasses = (color) => {
    switch (color) {
      case "green":
        return "bg-green-900/20 border-green-900/50 text-green-400";
      case "red":
        return "bg-red-900/20 border-red-900/50 text-red-400";
      case "amber":
        return "bg-amber-900/20 border-amber-900/50 text-amber-400";
      case "blue":
        return "bg-blue-900/20 border-blue-900/50 text-blue-400";
      case "purple":
        return "bg-purple-900/20 border-purple-900/50 text-purple-400";
      default:
        return "bg-purple-900/20 border-purple-900/50 text-purple-400";
    }
  };

  const colorClasses = getColorClasses(color);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`border rounded-lg p-5 transition-all ${colorClasses}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className={`p-2 rounded-full ${
              color === "green"
                ? "bg-green-900/30"
                : color === "red"
                ? "bg-red-900/30"
                : color === "amber"
                ? "bg-amber-900/30"
                : color === "blue"
                ? "bg-blue-900/30"
                : "bg-purple-900/30"
            }`}
            whileHover={{ rotate: 15 }}
            animate={{ scale: hovered ? 1.1 : 1 }}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
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

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="mt-4 pt-4 border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm opacity-80 mb-4">{details}</p>

            {actions && actions.length > 0 && (
              <div className="mt-3">
                <h4 className="text-xs font-medium uppercase tracking-wider opacity-70 mb-2">
                  Ações Recomendadas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1"
                    >
                      {action.icon && <action.icon className="h-3 w-3" />}
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
