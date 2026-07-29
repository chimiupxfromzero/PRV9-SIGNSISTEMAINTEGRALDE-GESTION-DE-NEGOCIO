import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Settings,
  Building2,
  Receipt,
  Cloud,
  Database,
  RefreshCw,
  Save,
  CheckCircle2,
  HardDriveUpload,
  HardDriveDownload,
  ShieldCheck,
  Printer,
} from "lucide-react";

export const ConfiguracionModule: React.FC = () => {
  const { businessConfig, updateBusinessConfig } = useApp();

  const [formData, setFormData] = useState(businessConfig);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [isBackupLoading, setIsBackupLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const triggerCloudBackupNow = async () => {
    setIsBackupLoading(true);
    setBackupStatus("Iniciando copia de seguridad encriptada hacia la nube...");

    try {
      const res = await fetch("/api/backup/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: formData.cloudBackupProvider }),
      });
      const data = await res.json();
      setBackupStatus(
        `✅ Backup completado exitosamente en ${formData.cloudBackupProvider}. ID de respaldo: ${data.backupId}`
      );
    } catch (err) {
      setBackupStatus("❌ Error al conectar con el servicio de almacenamiento en la nube.");
    } finally {
      setIsBackupLoading(false);
    }
  };

  const exportLocalDatabaseJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem("pv9_erp_state") || "{}");
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `PV9_ERP_BACKUP_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" /> Configuración General de la Aplicación PV9
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Datos comerciales de la empresa, personalización de tickets de venta y respaldo automático en nube.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-4 py-2 bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Configuración Guardada
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs text-white">
        {/* Section 1: Business Profile */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Building2 className="w-4 h-4 text-blue-400" /> Identidad y Datos del Negocio
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nombre Comercial de la Empresa</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">RFC de la Empresa</label>
              <input
                type="text"
                value={formData.rfc}
                onChange={(e) => setFormData({ ...formData, rfc: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono uppercase focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Dirección Física de la Sucursal</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Teléfono</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tasa Impuesto IVA (%)</label>
                <input
                  type="number"
                  value={formData.defaultTaxIVA}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultTaxIVA: parseFloat(e.target.value) || 16 })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono text-emerald-400 font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Hardware Configuration (Printers, Terminal, Scanner) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Printer className="w-4 h-4 text-purple-400" /> Configuración de Hardware y Periféricos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Tipo de Impresora de Tickets / Facturas</label>
              <select
                value={formData.printerName || "Impresora Térmica POS 80mm"}
                onChange={(e) => setFormData({ ...formData, printerName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
              >
                <option value="Impresora Térmica POS 80mm">Impresora Térmica POS 80mm (ESC/POS)</option>
                <option value="Impresora Térmica POS 58mm">Impresora Térmica Portátil 58mm</option>
                <option value="Impresora Inyección de Tinta / Láser PDF">Impresora Estándar Carta (Tinta/Láser)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Terminal Bancaria / Cobro Tarjeta</label>
              <select
                defaultValue="PLUG_PLAY_EMV"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
              >
                <option value="PLUG_PLAY_EMV">Plug & Play Directo USB/Bluetooth</option>
                <option value="CLIP_SMART">Terminal Clip Smart / Total</option>
                <option value="MERCADO_PAGO">Mercado Pago Point Smart</option>
                <option value="BBVA_BANAMEX">Pinpad Bancario Integrado (BBVA / Banamex / Banorte)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Scanner / Lector de Código de Barras</label>
              <select
                defaultValue="USB_HID"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
              >
                <option value="USB_HID">Plug & Play Automático (Teclado Emulado USB / 2D QR)</option>
                <option value="BT_WIRELESS">Scanner Inalámbrico Bluetooth</option>
                <option value="CAMERA_AI">Cámara Web Integrada (Lector Software)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Ticket & PDF Customization & Logo Upload */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Receipt className="w-4 h-4 text-emerald-400" /> Logotipo del Negocio y Personalización de Tickets & PDFs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                URL o Enlace del Logotipo de la Empresa
              </label>
              <input
                type="text"
                placeholder="https://empresa.com/logo.png"
                value={formData.logoUrl || ""}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Se imprimirá en la parte superior de los tickets de venta y facturas PDF CFDI.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Mensaje de Pie de Página en Ticket
              </label>
              <input
                type="text"
                value={formData.ticketFooterMessage}
                onChange={(e) => setFormData({ ...formData, ticketFooterMessage: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Cloud Backup & Data Sync */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Cloud className="w-4 h-4 text-sky-400" /> Respaldos Automatizados en la Nube (Dropbox / Drive / OneDrive)
          </h3>

          <p className="text-slate-400">
            Para prevenir la pérdida de datos por fallos de disco local, el sistema sube una copia encriptada del ERP cada cierto intervalo a su almacenamiento en nube configurado.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Proveedor de Nube</label>
              <select
                value={formData.cloudBackupProvider}
                onChange={(e) =>
                  setFormData({ ...formData, cloudBackupProvider: e.target.value as any })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
              >
                <option value="GOOGLE_DRIVE">Google Drive</option>
                <option value="DROPBOX">Dropbox</option>
                <option value="ONEDRIVE">Microsoft OneDrive</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Frecuencia de Respaldo</label>
              <select
                value={formData.backupIntervalHours}
                onChange={(e) =>
                  setFormData({ ...formData, backupIntervalHours: parseInt(e.target.value) || 6 })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
              >
                <option value={1}>Cada 1 Hora</option>
                <option value={6}>Cada 6 Horas</option>
                <option value={24}>Cada 24 Horas (Diario)</option>
                <option value={168}>Semanal</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              disabled={isBackupLoading}
              onClick={triggerCloudBackupNow}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <HardDriveUpload className="w-4 h-4" /> Respaldo Inmediato en Nube
            </button>

            <button
              type="button"
              onClick={exportLocalDatabaseJSON}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl transition flex items-center gap-2 cursor-pointer"
            >
              <HardDriveDownload className="w-4 h-4 text-emerald-400" /> Exportar Base de Datos Local (.JSON)
            </button>
          </div>

          {backupStatus && (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-emerald-300">
              {backupStatus}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-5 h-5" /> Guardar Todos los Cambios de Configuración
        </button>
      </form>
    </div>
  );
};
