import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CFDIInvoice } from "../../types";
import {
  FileCheck2,
  Wifi,
  WifiOff,
  ShieldCheck,
  FileCode,
  FileText,
  Printer,
  Settings,
  X,
  CheckCircle2,
  Lock,
  Download,
  KeyRound,
} from "lucide-react";

export const CFDIModule: React.FC = () => {
  const { sales, cfdiInvoices, cfdiSettings, updateCFDISettings, stampCFDI } = useApp();

  const [activeTab, setActiveTab] = useState<"VENTAS_POR_TIMBRAR" | "FACTURAS_TIMBRADAS" | "CONFIGURACION_CFDI">(
    "VENTAS_POR_TIMBRAR"
  );
  const [selectedXml, setSelectedXml] = useState<string | null>(null);
  const [selectedPdfInvoice, setSelectedPdfInvoice] = useState<CFDIInvoice | null>(null);
  const [isStampingId, setIsStampingId] = useState<string | null>(null);

  const pendingSales = sales.filter((s) => s.status === "COMPLETADA");

  const handleStamp = async (saleId: string) => {
    setIsStampingId(saleId);
    await stampCFDI(saleId);
    setIsStampingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-400" /> Facturación Electrónica CFDI 4.0 (México)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Módulo aislado de conectividad PAC para timbrado seguro ante el SAT con generación de XML y representación impresa PDF.
          </p>
        </div>

        {/* Isolated Internet Connection Badge & Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              updateCFDISettings({
                isOnlineForStamping: !cfdiSettings.isOnlineForStamping,
              })
            }
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              cfdiSettings.isOnlineForStamping
                ? "bg-emerald-950 border-emerald-500 text-emerald-300"
                : "bg-amber-950 border-amber-500 text-amber-300"
            }`}
          >
            {cfdiSettings.isOnlineForStamping ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-400" /> Conexión Aislada: ACTIVA
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-400" /> Conexión Aislada: OFFLINE
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("VENTAS_POR_TIMBRAR")}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "VENTAS_POR_TIMBRAR"
              ? "bg-indigo-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          Ventas Pendientes de Timbrar ({pendingSales.length})
        </button>

        <button
          onClick={() => setActiveTab("FACTURAS_TIMBRADAS")}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "FACTURAS_TIMBRADAS"
              ? "bg-indigo-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          Historial CFDI Timbrados ({cfdiInvoices.length})
        </button>

        <button
          onClick={() => setActiveTab("CONFIGURACION_CFDI")}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === "CONFIGURACION_CFDI"
              ? "bg-indigo-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Settings className="w-4 h-4" /> Configuración CFDI & PAC
        </button>
      </div>

      {/* TAB 1: Ventas por Timbrar */}
      {activeTab === "VENTAS_POR_TIMBRAR" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-xl text-xs text-indigo-200">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Seguridad de Aislamiento: El sistema abre una canalización encriptada punto a punto para timbrar con el PAC SAT.
              </span>
            </div>

            <button
              onClick={async () => {
                const publicSales = pendingSales.filter((s) => s.customerId === "cust-gen" || s.customerName === "Público en General");
                if (publicSales.length === 0) {
                  alert("No hay ventas pendientes acumuladas para Público en General.");
                  return;
                }
                const confirmBulk = confirm(`¿Generar Factura Global 4.0 para ${publicSales.length} ventas acumuladas de Público en General?`);
                if (confirmBulk) {
                  for (const sale of publicSales) {
                    await stampCFDI(sale.id);
                  }
                  alert("Facturación Global de Público en General procesada exitosamente.");
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow flex items-center gap-2 cursor-pointer shrink-0"
            >
              <FileText className="w-4 h-4" /> Facturar Global Público en General
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Folio Venta</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pendingSales.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500 italic">
                      No hay ventas pendientes por timbrar.
                    </td>
                  </tr>
                ) : (
                  pendingSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-slate-200">{sale.folio}</td>
                      <td className="p-3 text-slate-400">
                        {new Date(sale.timestamp).toLocaleString("es-MX")}
                      </td>
                      <td className="p-3 font-medium text-slate-100">{sale.customerName}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">
                        ${sale.total.toFixed(2)} MXN
                      </td>
                      <td className="p-3 text-center">
                        <button
                          disabled={isStampingId === sale.id}
                          onClick={() => handleStamp(sale.id)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow cursor-pointer disabled:opacity-50"
                        >
                          {isStampingId === sale.id ? "Timbrando..." : "Timbrar CFDI 4.0"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Facturas Timbradas */}
      {activeTab === "FACTURAS_TIMBRADAS" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Folio / UUID SAT</th>
                  <th className="p-3">Fecha Timbrado</th>
                  <th className="p-3">Receptor RFC</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {cfdiInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono">
                      <div className="font-bold text-indigo-300">{inv.folio}</div>
                      <div className="text-[10px] text-slate-400">{inv.uuid}</div>
                    </td>
                    <td className="p-3 text-slate-400">
                      {new Date(inv.fechaEmision).toLocaleString("es-MX")}
                    </td>
                    <td className="p-3 font-medium text-slate-200">
                      <div>{inv.receptorNombre}</div>
                      <div className="text-[10px] font-mono text-slate-500">RFC: {inv.receptorRFC}</div>
                    </td>
                    <td className="p-3 font-bold text-emerald-400 font-mono text-right">
                      ${inv.total.toFixed(2)}
                    </td>
                    <td className="p-3 text-center space-x-1">
                      <button
                        onClick={() => setSelectedXml(inv.xmlContent || "<xml></xml>")}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-semibold"
                      >
                        Ver XML
                      </button>
                      <button
                        onClick={() => setSelectedPdfInvoice(inv)}
                        className="px-2 py-1 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700 text-indigo-300 rounded-lg text-[10px] font-semibold"
                      >
                        PDF Rep. Impresa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Embedded CFDI Configuration */}
      {activeTab === "CONFIGURACION_CFDI" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 text-xs text-white">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-400" /> Configuración Propietaria de Facturación CFDI 4.0
            </h3>
            <p className="text-slate-400 mt-1">
              Parametrización de Certificados de Sello Digital (CSD), PAC autorizados por el SAT y aislamiento de red.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CSD & PAC Details */}
            <div className="space-y-4 bg-slate-950 p-4 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Certificado CSD SAT y PAC
              </h4>

              <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-xl space-y-1">
                <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Certificados CSD Cargados y Válidos
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  No. Serie: {cfdiSettings.csdCertificateNumber}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Proveedor PAC Autorizado</label>
                <input
                  type="text"
                  value={cfdiSettings.pacProviderName}
                  onChange={(e) => updateCFDISettings({ pacProviderName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Entorno de Operación</label>
                <select
                  value={cfdiSettings.pacEnvironment}
                  onChange={(e) => updateCFDISettings({ pacEnvironment: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                >
                  <option value="PRUEBAS">PRUEBAS (Sandbox SAT)</option>
                  <option value="PRODUCCION">PRODUCCIÓN (Validez Oficial)</option>
                </select>
              </div>
            </div>

            {/* Emisor Fiscal Details */}
            <div className="space-y-4 bg-slate-950 p-4 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" /> Datos Fiscales del Emisor
              </h4>

              <div>
                <label className="block text-slate-300 font-medium mb-1">RFC Emisor</label>
                <input
                  type="text"
                  value={cfdiSettings.defaultEmisorRFC}
                  onChange={(e) => updateCFDISettings({ defaultEmisorRFC: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono uppercase focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Razón Social Emisor</label>
                <input
                  type="text"
                  value={cfdiSettings.defaultEmisorNombre}
                  onChange={(e) => updateCFDISettings({ defaultEmisorNombre: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 uppercase focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Régimen Fiscal</label>
                  <input
                    type="text"
                    value={cfdiSettings.defaultEmisorRegimen}
                    onChange={(e) => updateCFDISettings({ defaultEmisorRegimen: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">CP Expedición</label>
                  <input
                    type="text"
                    value={cfdiSettings.defaultEmisorCP}
                    onChange={(e) => updateCFDISettings({ defaultEmisorCP: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* XML Modal */}
      {selectedXml && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" /> Contenido XML Timbrado (CFDI 4.0)
              </h3>
              <button onClick={() => setSelectedXml(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-96">
              {selectedXml}
            </pre>

            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedXml(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Representative Modal */}
      {selectedPdfInvoice && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-xl shadow-2xl text-slate-900">
            <div className="bg-white p-6 rounded-xl space-y-4 text-xs font-sans shadow-inner">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <div className="font-extrabold text-base text-gray-900">
                    {selectedPdfInvoice.emisorNombre}
                  </div>
                  <div className="text-[10px] text-gray-600">RFC: {selectedPdfInvoice.emisorRFC}</div>
                  <div className="text-[10px] text-gray-600">
                    Régimen Fiscal: {selectedPdfInvoice.emisorRegimen} | CP: {selectedPdfInvoice.emisorCP}
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-indigo-100 text-indigo-800 font-extrabold text-xs px-2 py-1 rounded">
                    FACTURA CFDI 4.0
                  </span>
                  <div className="font-bold text-sm mt-1">{selectedPdfInvoice.folio}</div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border text-[11px]">
                <div className="font-bold text-gray-800">RECEPTOR DE LA FACTURA</div>
                <div>{selectedPdfInvoice.receptorNombre}</div>
                <div className="text-gray-600 font-mono">
                  RFC: {selectedPdfInvoice.receptorRFC} | Uso CFDI: {selectedPdfInvoice.usoCFDI}
                </div>
              </div>

              <div className="border p-3 rounded-lg bg-gray-50 font-mono text-[10px] space-y-1">
                <div className="font-bold text-gray-800 font-sans">DATOS DEL TIMBRE FISCAL DIGITAL</div>
                <div className="truncate">UUID: {selectedPdfInvoice.uuid}</div>
                <div>Fecha Timbrado: {selectedPdfInvoice.fechaEmision}</div>
              </div>

              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>TOTAL FACTURADO:</span>
                <span className="text-emerald-700 font-mono">
                  ${selectedPdfInvoice.total.toFixed(2)} MXN
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  window.print();
                  setSelectedPdfInvoice(null);
                }}
                className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Imprimir Representación
              </button>
              <button
                onClick={() => setSelectedPdfInvoice(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
