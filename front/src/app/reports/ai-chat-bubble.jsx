"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIChatBubble({ onSendPrompt }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSendPrompt = async () => {
    if (!prompt.trim() || isLoading) return;

    // Add user message to chat
    setChatHistory((prev) => [...prev, { role: "user", content: prompt }]);

    setIsLoading(true);
    try {
      // Send prompt to AI
      const response = await onSendPrompt(prompt);

      // Add AI response to chat
      setChatHistory((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Desculpe, ocorreu um erro ao processar sua solicitação.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <motion.button
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg ${
          isOpen ? "bg-purple-700" : "bg-purple-600 hover:bg-purple-700"
        } transition-colors`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Fechar chat" : "Abrir chat com IA"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-full max-w-md bg-gray-900 border border-purple-900/50 rounded-lg shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Chat Header */}
            <div className="bg-gray-800 p-4 border-b border-purple-900/30">
              <h3 className="text-lg font-semibold text-purple-300">
                Assistente Financeiro
              </h3>
              <p className="text-gray-400 text-sm">
                Pergunte sobre seus dados financeiros
              </p>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="p-4 h-80 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
            >
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="w-12 h-12 text-purple-500/50 mb-3" />
                  <p className="text-gray-400">
                    Como posso ajudar com suas finanças hoje?
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-2 w-full max-w-xs">
                    <button
                      onClick={() => setPrompt("Quais são meus maiores gastos este mês?")}
                      className="text-sm text-left px-3 py-2 bg-gray-800 hover:bg-gray-750 rounded-lg text-purple-300 border border-purple-900/30"
                    >
                      Quais são meus maiores gastos este mês?
                    </button>
                    <button
                      onClick={() => setPrompt("Como posso economizar mais?")}
                      className="text-sm text-left px-3 py-2 bg-gray-800 hover:bg-gray-750 rounded-lg text-purple-300 border border-purple-900/30"
                    >
                      Como posso economizar mais?
                    </button>
                  </div>
                </div>
              ) : (
                chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 border border-purple-900/30 text-gray-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 border border-purple-900/30 rounded-lg p-3">
                    <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-purple-900/30 bg-gray-800">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 transition resize-none"
                  placeholder="Digite sua pergunta..."
                  rows={1}
                  style={{ minHeight: "44px", maxHeight: "120px" }}
                />
                <button
                  onClick={handleSendPrompt}
                  disabled={!prompt.trim() || isLoading}
                  className="p-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 rounded-full text-white transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
