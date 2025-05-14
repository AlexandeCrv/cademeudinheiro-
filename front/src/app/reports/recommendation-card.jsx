"use client";

import { useState } from "react";
import { Lightbulb, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";

export default function RecommendationCard({ recommendation }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedItems, setCompletedItems] = useState([]);

  const { title, description, priority, actionItems } = recommendation;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleItem = (index) => {
    if (completedItems.includes(index)) {
      setCompletedItems(completedItems.filter((i) => i !== index));
    } else {
      setCompletedItems([...completedItems, index]);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "alta":
        return "bg-red-900/20 border-red-900/50 text-red-400";
      case "média":
        return "bg-amber-900/20 border-amber-900/50 text-amber-400";
      case "baixa":
        return "bg-green-900/20 border-green-900/50 text-green-400";
      default:
        return "bg-purple-900/20 border-purple-900/50 text-purple-400";
    }
  };

  const priorityColor = getPriorityColor(priority);

  return (
    <div className="bg-gray-900/50 border border-purple-900/30 rounded-lg overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-purple-900/30">
              <Lightbulb className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-white">{title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor}`}>
                  {priority}
                </span>
              </div>
              <p className="text-sm text-gray-300 mt-1">{description}</p>
            </div>
          </div>
          <button
            onClick={toggleExpand}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5">
          <div className="pt-4 border-t border-purple-900/30">
            <h4 className="text-sm font-medium text-gray-300 mb-3">
              Ações Recomendadas:
            </h4>
            <ul className="space-y-2">
              {actionItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <button
                    onClick={() => toggleItem(index)}
                    className={`mt-0.5 rounded-full p-0.5 transition-colors ${
                      completedItems.includes(index)
                        ? "text-green-400 hover:text-green-500"
                        : "text-gray-500 hover:text-gray-400"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <span
                    className={`text-sm ${
                      completedItems.includes(index)
                        ? "text-gray-500 line-through"
                        : "text-gray-300"
                    }`}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
