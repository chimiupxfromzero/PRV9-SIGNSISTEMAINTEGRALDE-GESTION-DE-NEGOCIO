import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Sale, Refund } from "../../types";
import { RefreshCw, Search, ArrowLeft, CheckCircle2, DollarSign, Printer, X, ShieldAlert } from "lucide-react";

export const ReembolsosModule: React.FC = () => {
  const { sales, refunds, processRefund } = useApp();

  const [searchFolio, setSearchFolio] = useState("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [reason, setReason] = useState("Producto Defectuoso");
  const [returnToStock, setReturnToStock] = useState(true);
  const [completedRefund, setCompletedRefund] = useState<Refund | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = sales.find((s) => s.folio.toUpperCase() === searchFolio.trim().toUpperCase());
    if (found) {
      setSelectedSale(found);
    } else {
      alert("No se encontró ninguna venta activa con ese folio.");
    }
  };

  const handleProcessRefund = () => {
    if (!selectedSale) return;
    const ref = processRefund(selectedSale.id, reason, returnToStock);
    setCompletedRefund(ref);
    setSelectedSale(null);
    setSearchFolio("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-400" /> Reembolsos y Devoluciones de Venta
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión de garantías, cancelación de folios de ticket y reincorporación automática a almacén.
          </p>
        </div>
      </div>

      {/* Search Sale Section */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <h3 className="font-bold text-slate-100 text-sm">Buscar Ticket de Venta a Reembolsar</h3>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Ingrese el Folio exacto del Ticket (Ej: VTA-1001)..."
              value={searchFolio}
              onChange={(e) => setSearchFolio(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition shadow cursor-pointer"
          >
            Buscar Venta
          </button>
        </form>

        {/* Selected Sale Detail */}
        {selectedSale && (
          <div className="bg-slate-950 p-5 border border-amber-800/60 rounded-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {selectedSale.folio}
                </span>
                <h4 className="font-bold text-slate-100 text-sm mt-0.5">
                  Cliente: {selectedSale.customerName}
                </h4>
                <p className="text-[10px] text-slate-400">
                  Fecha: {new Date(selectedSale.timestamp).toLocaleString("es-MX")} | Método: {selectedSale.paymentMethod}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Monto Total Venta:</span>
                <div className="text-lg font-extrabold text-emerald-400 font-mono">
                  ${selectedSale.total.toFixed(2)} MXN
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="border border-slate-800 rounded-xl p-3 bg-slate-900 space-y-2 text-xs">
              <div className="font-semibold text-slate-300 mb-1">Artículos Incluidos:</div>
              {selectedSale.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-slate-400">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span className="font-mono text-slate-200">${item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Refund Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Motivo de la Devolución
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="Producto Defectuoso">Producto Defectuoso o Dañado</option>
                  <option value="Cambio de Opinión">Cambio de Opinión del Cliente</option>
                  <option value="Error en Cobro">Error en Cobro o Registro</option>
                  <option value="Garantía de Satisfacción">Garantía de Satisfacción</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="returnStock"
                  checked={returnToStock}
                  onChange={(e) => setReturnToStock(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="returnStock" className="text-xs text-slate-300 cursor-pointer">
                  Reincorporar existencias automáticamente al Almacén
                </label>
              </div>
            </div>

            <button
              onClick={handleProcessRefund}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs transition shadow-lg shadow-amber-600/30 cursor-pointer"
            >
              Confirmar y Procesar Reembolso Completo (${selectedSale.total.toFixed(2)})
            </button>
          </div>
        )}
      </div>

      {/* Refunds History */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="font-bold text-slate-100 text-sm">Historial de Reembolsos Emitidos</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Folio Reembolso</th>
                <th className="p-3">Folio Venta</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Motivo</th>
                <th className="p-3">Procesado Por</th>
                <th className="p-3 text-right">Monto Devuelto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {refunds.map((ref) => (
                <tr key={ref.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-amber-400">{ref.folio}</td>
                  <td className="p-3 font-mono text-slate-300">{ref.saleFolio}</td>
                  <td className="p-3 text-slate-400">
                    {new Date(ref.timestamp).toLocaleString("es-MX")}
                  </td>
                  <td className="p-3 text-slate-200">{ref.reason}</td>
                  <td className="p-3 text-slate-400">{ref.processedBy}</td>
                  <td className="p-3 font-bold text-amber-400 font-mono text-right">
                    -${ref.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Receipt Printable */}
      {completedRefund && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-slate-900">
            <div className="bg-white p-6 rounded-xl font-mono text-[11px] shadow-inner space-y-2">
              <div className="text-center font-bold text-sm">COMPROBANTE DE REEMBOLSO</div>
              <div className="text-center text-[10px] text-gray-600">PV9 ERP+POS</div>
              <div className="border-b border-dashed border-gray-400 my-2" />

              <div>Folio Reembolso: {completedRefund.folio}</div>
              <div>Folio Venta Original: {completedRefund.saleFolio}</div>
              <div>Fecha: {new Date(completedRefund.timestamp).toLocaleString("es-MX")}</div>
              <div>Motivo: {completedRefund.reason}</div>
              <div className="border-b border-dashed border-gray-400 my-2" />

              <div className="flex justify-between font-bold text-sm text-amber-700">
                <span>MONTO DEVUELTO:</span>
                <span>-${completedRefund.amount.toFixed(2)} MXN</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  window.print();
                  setCompletedRefund(null);
                }}
                className="w-1/2 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1"
              >
                <Printer className="w-4 h-4" /> Imprimir Recibo
              </button>
              <button
                onClick={() => setCompletedRefund(null)}
                className="w-1/2 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
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
