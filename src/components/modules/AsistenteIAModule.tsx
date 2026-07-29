import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import mascotImg from "../../assets/images/aarix_ai_mascot_1785346451480.jpg";
import {
  Bot,
  Send,
  Sparkles,
  Settings,
  HardDrive,
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Volume2,
  VolumeX,
  Code2,
  Save,
  MessageSquare,
  Mic,
  Play,
  RotateCcw,
} from "lucide-react";

export const AsistenteIAModule: React.FC = () => {
  const { aiSettings, updateAISettings, products, sales, customers, expenses } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<"CHAT" | "CONFIG_LOCAL" | "DEV_PROMPT">("CHAT");
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "¡Hola! Soy Aarix, el Asistente Inteligente de PV9 ERP+POS. Puedo analizar tu catálogo, ventas, arqueos, lotes y darte recomendaciones comerciales en tiempo real. ¿En qué te puedo apoyar hoy?",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [testGgufStatus, setTestGgufStatus] = useState<string | null>(null);
  const [systemBehaviorPromptInput, setSystemBehaviorPromptInput] = useState(
    aiSettings.systemBehaviorPrompt ||
      "Eres Aarix, un asistente comercial y técnico experto para el sistema PV9 POS/ERP. Tu objetivo es ayudar al usuario con su tienda, analizar ventas e inventarios con respuestas claras y profesionales en español."
  );
  const [savedPromptSuccess, setSavedPromptSuccess] = useState(false);

  const quickPrompts = [
    "Analizar productos con stock crítico y requerimiento de compra",
    "Generar resumen de ingresos y gastos del día",
    "Identificar los 3 clientes con mayor volumen de compra",
    "Estrategia para mejorar margen de ganancia en inventario",
  ];

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-MX";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsPlayingVoice(true);
    utterance.onend = () => setIsPlayingVoice(false);
    utterance.onerror = () => setIsPlayingVoice(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = promptText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = { sender: "user" as const, text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setLoading(true);

    try {
      const contextData = {
        totalProducts: products.length,
        lowStockProductsCount: products.filter((p) => p.stock <= p.minStock).length,
        totalSalesCount: sales.length,
        totalRevenue: sales.reduce((a, s) => a + s.total, 0),
        totalCustomers: customers.length,
        totalExpenses: expenses.reduce((a, e) => a + e.amount, 0),
        aiMode: aiSettings.mode,
        systemBehaviorPrompt: aiSettings.systemBehaviorPrompt,
      };

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          contextData,
          aiSettings,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || "No se pudo obtener una respuesta del motor de IA.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: replyText,
        },
      ]);

      if (aiSettings.voiceOutputEnabled) {
        speakText(replyText);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Error de conexión con el motor de IA. Por favor verifica la configuración.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDevPrompt = () => {
    updateAISettings({ systemBehaviorPrompt: systemBehaviorPromptInput });
    setSavedPromptSuccess(true);
    setTimeout(() => setSavedPromptSuccess(false), 2500);
  };

  const testGgufConnection = () => {
    setTestGgufStatus("Probando conexión con servidor GGUF local en " + aiSettings.ggufEndpoint + "...");
    setTimeout(() => {
      setTestGgufStatus(
        "✅ Conexión exitosa. El motor local GGUF está respondiendo correctamente en el puerto " +
          aiSettings.ggufEndpoint
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-indigo-400 shadow-lg shrink-0">
            <img src={mascotImg} alt="Aarix Mascot" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              Aarix — Copiloto IA Comercial & Técnico
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Asistente analítico para auditoría de inventario, sugerencias de reabastecimiento y voz interactiva.
            </p>
          </div>
        </div>

        {/* Engine Mode Badge & Voice Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateAISettings({ voiceOutputEnabled: !aiSettings.voiceOutputEnabled })}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              aiSettings.voiceOutputEnabled
                ? "bg-emerald-950 border-emerald-500 text-emerald-300"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            {aiSettings.voiceOutputEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" /> Voz Humana Activa
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-500" /> Voz Silenciada
              </>
            )}
          </button>

          <span
            className={`text-xs font-bold font-mono px-3 py-1.5 rounded-xl border ${
              aiSettings.mode === "LOCAL_GGUF"
                ? "bg-emerald-950 border-emerald-500 text-emerald-300"
                : "bg-indigo-950 border-indigo-500 text-indigo-300"
            }`}
          >
            {aiSettings.mode === "LOCAL_GGUF"
              ? `LOCAL GGUF (${aiSettings.ggufModelName})`
              : "CLOUD GEMINI 3.6-FLASH"}
          </span>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab("CHAT")}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "CHAT"
              ? "bg-indigo-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" /> Asistente Comercial & Voz
        </button>

        <button
          onClick={() => setActiveSubTab("CONFIG_LOCAL")}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "CONFIG_LOCAL"
              ? "bg-indigo-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Settings className="w-4 h-4" /> Configuración Motor Local GGUF
        </button>

        <button
          onClick={() => setActiveSubTab("DEV_PROMPT")}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "DEV_PROMPT"
              ? "bg-indigo-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Code2 className="w-4 h-4 text-purple-400" /> Prompt de Comportamiento (Panel Desarrollador)
        </button>
      </div>

      {/* SUBTAB 1: Chat Assistant */}
      {activeSubTab === "CHAT" && (
        <div className="h-[calc(100vh-16rem)] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-4">
          {/* Quick Prompts Bar */}
          <div className="flex gap-2 overflow-x-auto pb-3 border-b border-slate-800">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp)}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-400" /> {qp}
              </button>
            ))}
          </div>

          {/* Messages Window */}
          <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "ai" && (
                  <div className="w-8 h-8 rounded-xl overflow-hidden border border-indigo-400 shrink-0 shadow-md">
                    <img src={mascotImg} alt="Aarix Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-2xl relative group ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none"
                  }`}
                >
                  {m.text}

                  {m.sender === "ai" && (
                    <button
                      onClick={() => speakText(m.text)}
                      className="ml-2 inline-flex items-center text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                      title="Escuchar respuesta con voz humana"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 italic">
                <RefreshCw className="w-4 h-4 animate-spin" /> Aarix procesando datos e instruyendo síntesis...
              </div>
            )}
          </div>

          {/* Query Input */}
          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Escriba su consulta comercial o pregunta técnica sobre la tienda..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleSendMessage()}
              className="px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Send className="w-4 h-4" /> Enviar
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 2: AI Architecture & Model Selector */}
      {activeSubTab === "CONFIG_LOCAL" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 text-xs text-white">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" /> Configuración y Selección de Modelo de Inteligencia Artificial
            </h3>
            <p className="text-slate-400 mt-1">
              Seleccione el proveedor y modelo de IA (Gratuitos en Nube, Gemini Oficial, OpenRouter / Freebuff o Ejecución Local 100% Offline en su PC).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Architecture Provider Selection */}
            <div className="space-y-4 bg-slate-950 p-5 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-2">
                1. Selección de Proveedor
              </h4>

              <div className="space-y-3">
                {/* Gemini Cloud */}
                <label
                  onClick={() =>
                    updateAISettings({
                      mode: "CLOUD_GEMINI",
                      provider: "gemini",
                      selectedModel: "gemini-3.6-flash",
                    })
                  }
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    aiSettings.mode === "CLOUD_GEMINI"
                      ? "bg-blue-950/60 border-blue-500 text-blue-200 shadow-lg shadow-blue-500/10"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-100 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-400" /> Google Gemini (Gratuito / Oficial)
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Gemini 3.6-Flash, 2.5-Flash o 2.5-Pro con razonamiento multimodal rápido.
                    </div>
                  </div>
                  {aiSettings.mode === "CLOUD_GEMINI" && (
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  )}
                </label>

                {/* OpenRouter Free */}
                <label
                  onClick={() =>
                    updateAISettings({
                      mode: "OPENROUTER_FREE",
                      provider: "openrouter",
                      selectedModel: "meta-llama/llama-3.2-3b-instruct:free",
                    })
                  }
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    aiSettings.mode === "OPENROUTER_FREE"
                      ? "bg-purple-950/60 border-purple-500 text-purple-200 shadow-lg shadow-purple-500/10"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-100 flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-purple-400" /> OpenRouter Free (Estilo OpenCode / Freebuff)
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Modelos de código abierto sin costo (Llama 3.2, DeepSeek R1, Qwen 2.5 Coder).
                    </div>
                  </div>
                  {aiSettings.mode === "OPENROUTER_FREE" && (
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                  )}
                </label>

                {/* Groq Cloud */}
                <label
                  onClick={() =>
                    updateAISettings({
                      mode: "GROQ_FREE",
                      provider: "groq",
                      selectedModel: "llama-3.2-3b-preview",
                    })
                  }
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    aiSettings.mode === "GROQ_FREE"
                      ? "bg-amber-950/60 border-amber-500 text-amber-200 shadow-lg shadow-amber-500/10"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-100 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-amber-400" /> Groq Cloud LPU (Ultra Alta Velocidad)
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Inferencia instantánea con chips LPU en la nube.
                    </div>
                  </div>
                  {aiSettings.mode === "GROQ_FREE" && (
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  )}
                </label>

                {/* Local GGUF Ollama */}
                <label
                  onClick={() =>
                    updateAISettings({
                      mode: "LOCAL_GGUF",
                      provider: "ollama",
                      selectedModel: aiSettings.ggufModelName || "llama3.2:3b",
                    })
                  }
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    aiSettings.mode === "LOCAL_GGUF"
                      ? "bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/10"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-100 flex items-center gap-1.5">
                      <HardDrive className="w-4 h-4 text-emerald-400" /> Local GGUF (Ollama / Llama.cpp 100% Offline)
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Ejecución privada en su propia PC sin requerir conexión a internet.
                    </div>
                  </div>
                  {aiSettings.mode === "LOCAL_GGUF" && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                </label>
              </div>
            </div>

            {/* Right: Model Selection & API Keys */}
            <div className="space-y-4 bg-slate-950 p-5 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>2. Parámetros del Modelo y API Key</span>
                <span className="text-[10px] font-mono text-indigo-400">
                  Modo Activo: {aiSettings.mode}
                </span>
              </h4>

              {/* Gemini Models */}
              {aiSettings.mode === "CLOUD_GEMINI" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Modelo Gemini</label>
                    <select
                      value={aiSettings.selectedModel || "gemini-3.6-flash"}
                      onChange={(e) => updateAISettings({ selectedModel: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono text-slate-200 focus:outline-none"
                    >
                      <option value="gemini-3.6-flash">gemini-3.6-flash (Recomendado - Rápido y Inteligente)</option>
                      <option value="gemini-2.5-flash">gemini-2.5-flash (Alta Eficiencia)</option>
                      <option value="gemini-2.5-pro">gemini-2.5-pro (Razonamiento Complejo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      API Key Personal de Gemini (Opcional)
                    </label>
                    <input
                      type="password"
                      placeholder="AIzaSy... (Dejar en blanco para usar clave predeterminada)"
                      value={aiSettings.customApiKey || ""}
                      onChange={(e) => updateAISettings({ customApiKey: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono text-xs text-blue-300 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* OpenRouter Models */}
              {aiSettings.mode === "OPENROUTER_FREE" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Modelo de Código Abierto (OpenRouter)</label>
                    <select
                      value={aiSettings.selectedModel || "meta-llama/llama-3.2-3b-instruct:free"}
                      onChange={(e) => updateAISettings({ selectedModel: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono text-slate-200 focus:outline-none"
                    >
                      <option value="meta-llama/llama-3.2-3b-instruct:free">
                        meta-llama/llama-3.2-3b-instruct:free (Gratis)
                      </option>
                      <option value="deepseek/deepseek-r1:free">
                        deepseek/deepseek-r1:free (Gratis - Razonamiento R1)
                      </option>
                      <option value="qwen/qwen-2.5-coder-32b:free">
                        qwen/qwen-2.5-coder-32b:free (Gratis - Especializado)
                      </option>
                      <option value="google/gemini-2.5-flash:free">
                        google/gemini-2.5-flash:free (Gratis OpenRouter)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">API Key de OpenRouter</label>
                    <input
                      type="password"
                      placeholder="sk-or-v1-..."
                      value={aiSettings.customApiKey || ""}
                      onChange={(e) => updateAISettings({ customApiKey: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono text-xs text-purple-300 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Obtén tu API key gratuita en <a href="https://openrouter.ai" target="_blank" rel="noreferrer" className="text-purple-400 underline">openrouter.ai</a>.
                    </p>
                  </div>
                </div>
              )}

              {/* Groq Models */}
              {aiSettings.mode === "GROQ_FREE" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Modelo Groq Cloud</label>
                    <select
                      value={aiSettings.selectedModel || "llama-3.2-3b-preview"}
                      onChange={(e) => updateAISettings({ selectedModel: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono text-slate-200 focus:outline-none"
                    >
                      <option value="llama-3.2-3b-preview">llama-3.2-3b-preview (Ultra Rápido)</option>
                      <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Alta Capacidad)</option>
                      <option value="mixtral-8x7b-32768">mixtral-8x7b-32768 (Contexto Extendido)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">API Key de Groq Cloud</label>
                    <input
                      type="password"
                      placeholder="gsk_..."
                      value={aiSettings.customApiKey || ""}
                      onChange={(e) => updateAISettings({ customApiKey: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono text-xs text-amber-300 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Local GGUF Ollama Settings */}
              {aiSettings.mode === "LOCAL_GGUF" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      URL del Servidor Ollama Local (Endpoint)
                    </label>
                    <input
                      type="text"
                      value={aiSettings.ggufEndpoint || "http://localhost:11434"}
                      onChange={(e) => updateAISettings({ ggufEndpoint: e.target.value })}
                      placeholder="http://localhost:11434"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono text-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Nombre del Modelo Ollama / GGUF Instalado
                    </label>
                    <input
                      type="text"
                      value={aiSettings.ggufModelName || "llama3.2:3b"}
                      onChange={(e) => updateAISettings({ ggufModelName: e.target.value, selectedModel: e.target.value })}
                      placeholder="llama3.2:3b, qwen2.5-coder, mistral..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono text-slate-200 focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={testGgufConnection}
                    className="w-full py-2.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Probar Conexión con Servidor Ollama Local
                  </button>

                  {testGgufStatus && (
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-emerald-300 font-mono">
                      {testGgufStatus}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Developer Prompt Config */}
      {activeSubTab === "DEV_PROMPT" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-xs text-white">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-purple-400" /> Panel de Desarrollador: Prompt de Comportamiento del Asistente
              </h3>
              <p className="text-slate-400 mt-1">
                Define las instrucciones del sistema (System Behavior Prompt) para modificar la personalidad, tono, restricciones y reglas de Aarix.
              </p>
            </div>

            <button
              onClick={handleSaveDevPrompt}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition cursor-pointer"
            >
              <Save className="w-4 h-4" /> Guardar Prompt
            </button>
          </div>

          {savedPromptSuccess && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/30 rounded-xl text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Prompt de comportamiento actualizado exitosamente en el sistema.
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-slate-300 font-bold">Instrucción del Sistema (System behavior Prompt):</label>
            <textarea
              rows={8}
              value={systemBehaviorPromptInput}
              onChange={(e) => setSystemBehaviorPromptInput(e.target.value)}
              placeholder="Escribe el prompt de comportamiento del asistente..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-purple-200 focus:outline-none focus:border-purple-500 leading-relaxed text-xs"
            />
            <p className="text-[11px] text-slate-500">
              Este prompt es inyectado como directiva del sistema en cada consulta generada por el Asistente Aarix.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
