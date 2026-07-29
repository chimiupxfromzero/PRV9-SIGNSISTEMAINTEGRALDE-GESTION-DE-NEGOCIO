import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Palette, Sparkles, Check, Layout, Moon, Sun, Monitor } from "lucide-react";

export const TemasAarixModule: React.FC = () => {
  const { currentTheme, setTheme } = useApp();

  const themesList = [
    {
      id: "frosted_glass",
      name: "Cristal Esmerilado (Frosted Glass)",
      desc: "Diseño ultramoderno con paneles translúcidos de fondo graduado, desenfoque de fondo (backdrop blur) y bordes de cristal de alto contraste.",
      primaryColor: "#3b82f6",
      bgPreview: "bg-white/10 backdrop-blur-md border-white/20",
      accentPreview: "bg-blue-500",
    },
    {
      id: "dark_pro",
      name: "Oscuro Profesional PV9",
      desc: "Fondo grafito slate de alto contraste y balance visual óptimo para largas jornadas de trabajo.",
      primaryColor: "#3b82f6",
      bgPreview: "bg-slate-950 border-slate-800",
      accentPreview: "bg-blue-600",
    },
    {
      id: "cyber_neon",
      name: "Azul Neón Cyberpunk",
      desc: "Líneas de contraste vibrante con acentos azul neón e índigo para ambientes de alto rendimiento.",
      primaryColor: "#6366f1",
      bgPreview: "bg-slate-950 border-indigo-900/50",
      accentPreview: "bg-indigo-500",
    },
    {
      id: "emerald_executive",
      name: "Verde Esmeralda Ejecutivo",
      desc: "Tonalidades sobrias orientadas a finanzas, comercio exterior y contabilidad corporativa.",
      primaryColor: "#10b981",
      bgPreview: "bg-slate-950 border-emerald-900/50",
      accentPreview: "bg-emerald-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-400" /> Studio de Temas y Personalización UI (Aarix Engine)
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Personalice la experiencia visual del ERP+POS con esquemas cromáticos de alto contraste y densidad adaptable.
          </p>
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {themesList.map((t) => {
          const isSelected = currentTheme === t.id || (t.id === "frosted_glass" && currentTheme !== "dark_pro" && currentTheme !== "cyber_neon" && currentTheme !== "emerald_executive");
          return (
            <div
              key={t.id}
              onClick={() => setTheme(t.id as any)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between shadow-2xl ${
                isSelected
                  ? "bg-white/15 backdrop-blur-xl border-blue-400/60 ring-2 ring-blue-500/30"
                  : "bg-white/5 backdrop-blur-md border-white/10 hover:border-white/20"
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-100 text-sm">{t.name}</h3>
                  {isSelected && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/50 text-blue-200 text-[10px] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Tema Activo
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{t.desc}</p>

                {/* Visual Palette Preview */}
                <div className={`p-3 rounded-xl border ${t.bgPreview} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${t.accentPreview}`} />
                    <span className="text-xs font-mono text-slate-300">Color Primario</span>
                  </div>

                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded bg-white/20" />
                    <div className="w-3 h-3 rounded bg-white/40" />
                    <div className="w-3 h-3 rounded bg-blue-500" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-right">
                <button
                  onClick={() => setTheme(t.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-white/10 hover:bg-white/20 text-slate-200"
                  }`}
                >
                  {isSelected ? "Aplicado" : "Seleccionar Tema"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
