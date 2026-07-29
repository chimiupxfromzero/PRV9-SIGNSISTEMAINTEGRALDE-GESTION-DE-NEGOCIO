import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { OnboardingTutorialModal } from "./OnboardingTutorialModal";
import mascotImg from "../assets/images/aarix_ai_mascot_1785346451480.jpg";
import {
  ShieldCheck,
  Wifi,
  WifiOff,
  CloudCheck,
  Bell,
  User,
  Sparkles,
  KeyRound,
  Store,
  Check,
  X,
  Database,
  Lock,
  HelpCircle,
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    businessConfig,
    currentUser,
    users,
    switchUserByPin,
    activeModule,
    setActiveModule,
    cfdiSettings,
    updateCFDISettings,
    backupConfig,
    notifications,
    markNotificationRead,
    clearNotifications,
  } = useApp();

  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = switchUserByPin(pinInput);
    if (success) {
      setShowPinModal(false);
      setPinInput("");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <header className="bg-white/5 backdrop-blur-xl text-white border-b border-white/10 px-5 py-3 flex items-center justify-between shadow-2xl select-none sticky top-0 z-40">
      {/* Left: Window branding & Business Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded-lg backdrop-blur-md">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold tracking-wider text-blue-400 text-sm">
            PV9 ERP+POS
          </span>
          <span className="text-[10px] bg-blue-500/30 text-blue-300 font-mono px-1.5 py-0.5 rounded">
            v4.2 Local
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-slate-300 text-sm border-l border-white/10 pl-3">
          <Store className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-200">
            {businessConfig.businessName}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            ({businessConfig.rfc})
          </span>
        </div>
      </div>

      {/* Middle: System Hardware & Connection Status Indicators */}
      <div className="hidden lg:flex items-center gap-3 text-xs">
        {/* Local DB Status */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 backdrop-blur-md"
          title="Base de Datos Local SQLite/IndexedDB activa sin latencia"
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>BD Local:</span>
          <span className="text-emerald-400 font-semibold">100% OK</span>
        </div>

        {/* CFDI Isolated Connection Toggle */}
        <button
          onClick={() =>
            updateCFDISettings({
              isOnlineForStamping: !cfdiSettings.isOnlineForStamping,
            })
          }
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer backdrop-blur-md ${
            cfdiSettings.isOnlineForStamping
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
              : "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
          }`}
          title="Aislamiento seguro de conexión CFDI. Haga clic para conectar/desconectar"
        >
          {cfdiSettings.isOnlineForStamping ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>CFDI:</span>
              <span className="font-semibold text-emerald-400">
                Aislado Conectado
              </span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span>CFDI:</span>
              <span className="font-semibold text-amber-400">
                Aislado Offline
              </span>
            </>
          )}
        </button>

        {/* Cloud Backup Sync */}
        <div
          onClick={() => setActiveModule("respaldos")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:border-blue-400/40 cursor-pointer transition backdrop-blur-md"
          title="Copia de seguridad en la nube activada"
        >
          <CloudCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Respaldos:</span>
          <span className="text-blue-300 font-semibold">
            {backupConfig.provider} ({backupConfig.autoBackupIntervalMinutes}m)
          </span>
        </div>
      </div>

      {/* Right: Notifications, AI Assistant & User Profile Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mascot Tutorial Guide Button */}
        <button
          onClick={() => setShowTutorialModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-400/40 text-indigo-200 font-semibold text-xs shadow-lg transition cursor-pointer backdrop-blur-md"
          title="Tutorial Guiado por Aarix Mascot IA"
        >
          <div className="w-5 h-5 rounded-full overflow-hidden border border-indigo-300 shrink-0">
            <img src={mascotImg} alt="Aarix Mascot" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <span className="hidden md:inline">Tutorial Aarix</span>
        </button>

        {/* Quick AI Assistant Trigger */}
        <button
          onClick={() => setActiveModule("asistente_ia")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium text-xs shadow-lg transition cursor-pointer backdrop-blur-md ${
            activeModule === "asistente_ia"
              ? "bg-blue-600/80 text-white border border-blue-400/50 shadow-blue-500/30"
              : "bg-white/10 border border-white/20 text-indigo-300 hover:bg-white/20"
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
          <span className="hidden sm:inline">Asistente IA</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 rounded-full bg-white/10 border border-white/20 text-slate-300 hover:text-white hover:bg-white/20 transition relative cursor-pointer backdrop-blur-md"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl z-50 text-xs overflow-hidden">
              <div className="p-3 bg-white/5 border-b border-white/10 flex justify-between items-center gap-2">
                <span className="font-semibold text-slate-200">
                  Notificaciones ({unreadNotifs.length})
                </span>
                <div className="flex items-center gap-2">
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={() => {
                        notifications.forEach((n) => markNotificationRead(n.id));
                      }}
                      className="text-[10px] text-blue-400 hover:text-blue-300 underline font-medium cursor-pointer"
                    >
                      Leídas
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={() => clearNotifications()}
                      className="text-[10px] text-rose-400 hover:text-rose-300 underline font-medium cursor-pointer"
                    >
                      Limpiar
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifDropdown(false)}
                    className="text-slate-400 hover:text-white cursor-pointer ml-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 italic">
                    Sin notificaciones pendientes
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.actionLink) setActiveModule(n.actionLink);
                        setShowNotifDropdown(false);
                      }}
                      className={`p-3 hover:bg-white/10 cursor-pointer transition ${
                        !n.read ? "bg-white/5" : "opacity-75"
                      }`}
                    >
                      <div className="flex justify-between font-medium text-slate-200 mb-1">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(n.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role & Switcher */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <button
            onClick={() => setShowPinModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition cursor-pointer text-left backdrop-blur-md"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-xs font-semibold text-slate-100 flex items-center gap-1">
                {currentUser.name.split(" ")[0]}
                <KeyRound className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-[10px] text-blue-300 font-medium">
                {currentUser.role}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* PIN Switcher Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-white">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg text-slate-100">
                  Cambiar Usuario por PIN
                </h3>
              </div>
              <button
                onClick={() => setShowPinModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-400 text-xs mb-4">
              Ingrese su PIN de 4 dígitos para ingresar con sus permisos asignados.
            </p>

            {/* User Quick Avatars */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {users.map((u) => (
                <div
                  key={u.id}
                  onClick={() => setPinInput(u.pin)}
                  className={`p-2 rounded-xl border text-center cursor-pointer transition ${
                    currentUser.id === u.id
                      ? "border-blue-500 bg-blue-950/40 text-blue-200"
                      : "border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-300"
                  }`}
                >
                  <div className="text-xs font-semibold truncate">{u.name.split(" ")[0]}</div>
                  <div className="text-[10px] text-slate-400">{u.role}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Código PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="****"
                  autoFocus
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono py-2.5 bg-slate-950 border border-slate-700 rounded-xl focus:border-blue-500 focus:outline-none text-blue-400"
                />
                {pinError && (
                  <p className="text-rose-400 text-xs mt-1 text-center font-medium">
                    PIN incorrecto o usuario inactivo.
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="w-1/2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-lg shadow-blue-600/30"
                >
                  Confirmar PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Onboarding Tutorial Modal led by Aarix Mascot */}
      <OnboardingTutorialModal
        isOpen={showTutorialModal}
        onClose={() => setShowTutorialModal(false)}
      />
    </header>
  );
};
