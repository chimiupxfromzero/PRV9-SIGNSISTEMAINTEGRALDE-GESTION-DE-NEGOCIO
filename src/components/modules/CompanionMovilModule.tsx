import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import mascotImg from "../../assets/images/aarix_ai_mascot_1785346451480.jpg";
import {
  Smartphone,
  MessageSquare,
  Send,
  PhoneCall,
  Sparkles,
  Bot,
  User,
  Clock,
  MapPin,
  CheckCheck,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

export const CompanionMovilModule: React.FC = () => {
  const { businessConfig, products } = useApp();
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "companion"; text: string; time: string; actionWhatsApp?: boolean }>
  >([
    {
      sender: "companion",
      text: `¡Hola! Soy Aarix Companion, el bot inteligente de ${businessConfig.businessName}. ¿En qué puedo ayudarte hoy?`,
      time: "10:00 AM",
    },
    {
      sender: "user",
      text: "¿Tienen disponible Aceite Multigrado y cuál es su precio?",
      time: "10:01 AM",
    },
    {
      sender: "companion",
      text: "¡Sí, claro! Tenemos 'Aceite Multigrado 20W50 1L' en existencia por $78.00 MXN. ¿Te gustaría apartar unidades o que te conecte con un ejecutivo de ventas?",
      time: "10:01 AM",
    },
  ]);

  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const messageText = textToSend || inputMsg;
    if (!messageText.trim()) return;

    const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsgs = [
      ...messages,
      { sender: "user" as const, text: messageText, time: nowStr },
    ];
    setMessages(newMsgs);
    if (!textToSend) setInputMsg("");
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = `Entendido. Gracias por consultar con ${businessConfig.businessName}. Si necesitas asistencia personalizada con tus pedidos o facturación, puedo transferirte con un asesor humano.`;
      let offerWhatsApp = false;

      const lower = messageText.toLowerCase();
      if (lower.includes("horario") || lower.includes("hora") || lower.includes("abierto")) {
        botResponse = `Nuestro horario de atención es de Lunes a Sábado de 8:00 AM a 8:00 PM y Domingos de 9:00 AM a 3:00 PM. Ubicación: ${businessConfig.address}`;
      } else if (lower.includes("precio") || lower.includes("producto") || lower.includes("stock") || lower.includes("inventario")) {
        const p = products[0];
        botResponse = `Contamos con amplio catálogo. Por ejemplo, ${p?.name || "nuestros productos de alta demanda"} está disponible en tienda por $${p?.price.toFixed(2) || "45.00"} MXN.`;
      } else if (lower.includes("asesor") || lower.includes("humano") || lower.includes("whatsapp") || lower.includes("comprar")) {
        botResponse = `Un ejecutivo de ${businessConfig.businessName} te atenderá directamente en WhatsApp para confirmar tus compras y facturas. Haz clic abajo para chatear.`;
        offerWhatsApp = true;
      }

      setMessages((prev) => [
        ...prev,
        { sender: "companion", text: botResponse, time: nowStr, actionWhatsApp: offerWhatsApp },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const whatsappPhone = businessConfig.phone.replace(/[^0-9]/g, "") || "525558007890";
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hola, vengo desde Aarix Companion de ${businessConfig.businessName} y necesito hablar con un asesor.`
  )}`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-lg shrink-0">
            <img src={mascotImg} alt="Aarix Mascot" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              Aarix Companion Móvil & Bot de Atención WhatsApp
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Extensión del avatar de IA para clientes finales: resuelve consultas frecuentes 24/7 y transfiere a asesores humanos vía WhatsApp.
            </p>
          </div>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer shrink-0"
        >
          <PhoneCall className="w-4 h-4" /> Probar Enlace WhatsApp Asesor
        </a>
      </div>

      {/* Grid: Phone Simulator & Explanatory Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Phone Frame Simulator */}
        <div className="lg:col-span-6 xl:col-span-5 mx-auto w-full max-w-sm">
          <div className="bg-slate-950 border-4 border-slate-800 rounded-[3rem] shadow-2xl p-3 overflow-hidden relative">
            {/* Camera notch */}
            <div className="w-32 h-5 bg-slate-900 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800" />
            </div>

            {/* Screen Area */}
            <div className="bg-slate-900 rounded-[2.2rem] pt-7 pb-4 px-3 min-h-[520px] flex flex-col justify-between relative border border-white/5">
              {/* Chat Screen Header */}
              <div className="bg-emerald-950/80 border border-emerald-500/30 p-2.5 rounded-2xl flex items-center justify-between mb-3 shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-400 shrink-0">
                    <img src={mascotImg} alt="Aarix Mascot" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-white flex items-center gap-1">
                      Aarix Companion
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                    </div>
                    <div className="text-[10px] text-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      En línea (PV9 Bot Oficial)
                    </div>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-xl bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 hover:text-white transition cursor-pointer"
                  title="Abrir en WhatsApp"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[360px] pr-1 text-xs">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                        m.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-none shadow-md"
                          : "bg-slate-800 text-slate-200 border border-white/10 rounded-bl-none shadow-md"
                      }`}
                    >
                      {m.text}

                      {m.actionWhatsApp && (
                        <div className="mt-2.5 pt-2 border-t border-white/10">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md"
                          >
                            <PhoneCall className="w-3.5 h-3.5" /> Chatear con Asesor Humano
                          </a>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1 flex items-center gap-1">
                      {m.time} {m.sender === "user" && <CheckCheck className="w-3 h-3 text-blue-400" />}
                    </span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] bg-slate-800/60 p-2 rounded-xl w-fit">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    Aarix está escribiendo...
                  </div>
                )}
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="my-2 flex gap-1.5 overflow-x-auto text-[10px]">
                <button
                  onClick={() => handleSendMessage("¿Cuál es el horario de atención?")}
                  className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 whitespace-nowrap cursor-pointer"
                >
                  Horarios
                </button>
                <button
                  onClick={() => handleSendMessage("¿Tienen productos en stock?")}
                  className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 whitespace-nowrap cursor-pointer"
                >
                  Consultar Stock
                </button>
                <button
                  onClick={() => handleSendMessage("Quiero hablar con un asesor humano")}
                  className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 whitespace-nowrap cursor-pointer"
                >
                  Asesor Humano
                </button>
              </div>

              {/* Chat Input */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <input
                  type="text"
                  placeholder="Escribe un mensaje al bot..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Companion Business Advantages Panel */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-4 text-xs text-slate-300">
          <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center gap-2 font-bold text-base text-white">
              <Sparkles className="w-5 h-5 text-emerald-400" /> Beneficios del Avatar "Aarix Companion" Móvil
            </div>
            <p className="leading-relaxed">
              El asistente inteligente trasciende la pantalla del cajero y se proyecta hacia tus clientes.
              Permite reducir hasta en un 80% las llamadas repetitivas sobre precios, catálogo o ubicación.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" /> Atención 24/7 sin descargas
                </div>
                <p className="text-[11px] text-slate-400">
                  Responde dudas frecuentes aun cuando tu tienda física o caja esté cerrada.
                </p>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-blue-400" /> Derivación a WhatsApp Humano
                </div>
                <p className="text-[11px] text-slate-400">
                  Transfiere clientes calificados directamente a tu número de WhatsApp con un solo clic.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl shadow-xl space-y-3">
            <h3 className="font-bold text-white text-sm">Configuración de Conexión Comercial</h3>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Negocio Registrado:</span>
                <span className="font-bold text-white">{businessConfig.businessName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Teléfono de Enlace WhatsApp:</span>
                <span className="font-mono font-bold text-emerald-400">{businessConfig.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Dirección en Bot:</span>
                <span className="text-slate-200">{businessConfig.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
