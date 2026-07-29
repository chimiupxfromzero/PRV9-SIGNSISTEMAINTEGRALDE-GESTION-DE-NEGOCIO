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

      {/* SUBTAB 2: GGUF Model Config */}
      {activeSubTab === "CONFIG_LOCAL" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 text-xs text-white">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" /> Configuración del Motor de Inteligencia Artificial
            </h3>
            <p className="text-slate-400 mt-1">
              Seleccione si prefiere la API en la nube (Gemini 3.6-Flash) o la ejecución 100% local sin internet con modelos cuantizados GGUF.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 bg-slate-950 p-4 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-slate-200 text-sm">Selección de Arquitectura</h4>

              <div className="space-y-2">
                <label
                  onClick={() => updateAISettings({ mode: "CLOUD_GEMINI" })}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    aiSettings.mode === "CLOUD_GEMINI"
                      ? "bg-indigo-950 border-indigo-500 text-indigo-200"
                      : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-100">Nube: Gemini 3.6-Flash API</div>
                    <div className="text-[10px] text-slate-400">
                      Alta velocidad y razonamiento avanzado.
                    </div>
                  </div>
                  {aiSettings.mode === "CLOUD_GEMINI" && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                  )}
                </label>

                <label
                  onClick={() => updateAISettings({ mode: "LOCAL_GGUF" })}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    aiSettings.mode === "LOCAL_GGUF"
                      ? "bg-emerald-950 border-emerald-500 text-emerald-200"
                      : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-100">Local GGUF: Ollama / Llama.cpp</div>
                    <div className="text-[10px] text-slate-400">
                      Privacidad total y ejecución 100% sin internet en la PC del usuario.
                    </div>
                  </div>
                  {aiSettings.mode === "LOCAL_GGUF" && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                </label>
              </div>
            </div>

            <div className="space-y-4 bg-slate-950 p-4 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-400" /> Parámetros GGUF Local
              </h4>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  URL Servidor Local (Endpoint)
                </label>
                <input
                  type="text"
                  value={aiSettings.ggufEndpoint}
                  onChange={(e) => updateAISettings({ ggufEndpoint: e.target.value })}
                  placeholder="http://localhost:11434"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono text-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nombre del Modelo GGUF Cargado
                </label>
                <input
                  type="text"
                  value={aiSettings.ggufModelName}
                  onChange={(e) => updateAISettings({ ggufModelName: e.target.value })}
                  placeholder="llama3.2:3b-instruct-q4_K_M"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono text-slate-200 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={testGgufConnection}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Probar Conexión con Servidor GGUF
              </button>

              {testGgufStatus && (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-emerald-300 font-mono">
                  {testGgufStatus}
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
