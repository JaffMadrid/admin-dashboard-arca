import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const QUICK_ACTIONS = [
  {
    label: "¿Cómo ingresar material?",
    prompt: "¿Cómo puedo ingresar nuevo material al inventario?",
  },
  {
    label: "Realizar una venta",
    prompt: "¿Cómo registro una venta de material?",
  },
  {
    label: "Ver inventario",
    prompt: "¿Cómo puedo consultar el inventario actual?",
  },
];

const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAIResponse = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = { type: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch(
        "https://admin-dashboard-arca-backend.vercel.app/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: input }),
        }
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { type: "bot", content: data.response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Lo siento, hubo un error al procesar tu solicitud.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content) => {
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i !== content.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="flex flex-col h-[600px] w-full mx-auto bg-gray-800 bg-opacity-50 backdrop-blur-md border border-gray-700 mb-8 rounded-xl overflow-hidden">
      {/* Chat Messages */}
      <h2 className="text-2xl font-bold text-white p-4 border-b border-gray-700 bg-gray-800 bg-opacity-60">
        Asistente Virtual - Sistema de Inventario
      </h2>
      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-700 bg-gray-800 bg-opacity-60 flex gap-2 overflow-x-auto">
        {QUICK_ACTIONS.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              setInput(action.prompt);
              handleAIResponse();
            }}
            className="whitespace-nowrap px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors"
          >
            {action.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-4">
            <p>👋 ¡Hola! Soy tu asistente virtual.</p>
            <p>¿En qué puedo ayudarte con el sistema de inventario?</p>
          </div>
        )}
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-line ${
                  message.type === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-gray-700 text-gray-200 rounded-tl-none"
                }`}
              >
                {formatMessage(message.content)}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-gray-400"
            >
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAIResponse()}
            className="flex-1 bg-gray-700 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="Escribe tu mensaje..."
          />
          <button
            onClick={handleAIResponse}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Enviar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
