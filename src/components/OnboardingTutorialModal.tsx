import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ShoppingCart,
  Package,
  FileCheck2,
  Users,
  Shield,
  Bot,
  Play,
} from "lucide-react";
import mascotImg from "../assets/images/aarix_ai_mascot_1785346451480.jpg";

interface OnboardingTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingTutorialModal: React.FC<OnboardingTutorialModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { setActiveModule, currentUser } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRoleTour, setSelectedRoleTour] = useState<string>(currentUser.role || "Cajero");

  if (!isOpen) return null;

  const steps = [
    {
      title: "¡Hola! Soy Aarix, tu Asistente IA Integrado",
      subtitle: "Bienvenido a PV9 ERP+POS",
      content: (
        <div className="space-y-4 text-slate-300 text-xs leading-relaxed">
          <p>
            Te doy la bienvenida a la plataforma más avanzada y segura para la gestión integral de tu negocio.
            Como tu copiloto virtual, estoy programado para asistirte en tiempo real con análisis de ventas,
            alertas de inventario, timbrado fiscal CFDI 4.0 y respuestas instantáneas sobre tus operaciones.
          </p>
          <div className="bg-blue-950/40 border border-blue-500/30 p-3 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">Aislamiento & Rendimiento Offline-First</div>
              <div className="text-[11px] text-blue-200">
                PV9 opera al 100% de velocidad local sin dependencia de internet, abriendo canales seguros únicamente para timbrado fiscal o sincronización en la nube.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Personaliza tu Recorrido según tu Rol",
      subtitle: "Selecciona cómo operarás el sistema hoy",
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-300">
            Aarix adaptará los primeros pasos a tus tareas diarias principales:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              {
                role: "Cajero",
                icon: <ShoppingCart className="w-4 h-4 text-emerald-400" />,
                desc: "Ventas rápidas, escaneo de códigos, pagos mixtos y facturación express.",
              },
              {
                role: "Administrador",
                icon: <Package className="w-4 h-4 text-blue-400" />,
                desc: "Cortes de caja, inventarios masivos CSV, gastos y permisos de personal.",
              },
              {
                role: "Contador / CFDI",
                icon: <FileCheck2 className="w-4 h-4 text-indigo-400" />,
                desc: "Timbrado masivo de facturas 4.0, facturación global al público y nómina.",
              },
              {
                role: "Desarrollador / Licencias",
                icon: <Shield className="w-4 h-4 text-purple-400" />,
                desc: "Activación/bloqueo de módulos por contrato de cliente y temas visuales.",
              },
            ].map((item) => (
              <div
                key={item.role}
                onClick={() => setSelectedRoleTour(item.role)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedRoleTour === item.role
                    ? "bg-blue-600/25 border-blue-400 text-white shadow-lg shadow-blue-500/10"
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1 text-slate-100">
                  {item.icon} {item.role}
                </div>
                <div className="text-[11px] text-slate-300">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Funciones Clave Destacadas",
      subtitle: `Optimizado para el rol de ${selectedRoleTour}`,
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <p className="font-semibold text-slate-100">
            Aarix ha preparado estos accesos directos para comenzar de inmediato:
          </p>

          <div className="space-y-2">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-100">Cobro Mixto y Alta Rápida en Punto de Venta:</span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Acepta múltiples formas de pago en un mismo ticket (Efectivo + Tarjeta) y registra nuevos clientes para facturar sin perder los artículos del carrito.
                </p>
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-100">Importación Masiva de Inventario (CSV):</span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Carga miles de productos desde Excel/CSV o exporta tu catálogo en un solo clic sin ingresar artículo por artículo.
                </p>
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-100">Facturación Global CFDI 4.0 (Público en General):</span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Junta múltiples tickets no facturados de público en general para emitir una sola factura global del día o semana en segundos.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "¡Todo Listo para Empezar!",
      subtitle: "Aarix está siempre disponible en la barra superior",
      content: (
        <div className="space-y-4 text-center text-xs text-slate-300">
          <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-blue-400 shadow-2xl relative">
            <img
              src={mascotImg}
              alt="Mascota Aarix IA"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent" />
          </div>

          <p className="max-w-sm mx-auto">
            Puedes invocarme en cualquier momento desde el botón <span className="text-indigo-400 font-bold">Asistente IA</span> en el menú superior para analizar tus reportes o realizar consultas por voz/texto.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                onClose();
                setActiveModule("pos");
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" /> Ir a Punto de Venta
            </button>
            <button
              onClick={() => {
                onClose();
                setActiveModule("asistente_ia");
              }}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-indigo-300 font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4" /> Hablar con Aarix
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-start sm:items-center justify-center z-50 p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900/95 border border-white/20 rounded-3xl p-5 sm:p-6 w-full max-w-xl shadow-2xl text-white relative overflow-hidden backdrop-blur-2xl my-auto max-h-[92vh] flex flex-col">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header with Mascot Avatar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-blue-400/80 shadow-lg relative shrink-0">
              <img
                src={mascotImg}
                alt="Aarix Mascot"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base text-white tracking-wide">
                  {steps[currentStep].title}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[10px] font-bold">
                  IA Aarix
                </span>
              </div>
              <p className="text-xs text-slate-400">{steps[currentStep].subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="py-4 my-auto min-h-[220px] overflow-y-auto">{steps[currentStep].content}</div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 shrink-0">
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? "w-6 bg-blue-500"
                    : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                Comenzar <Play className="w-4 h-4 fill-current" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
