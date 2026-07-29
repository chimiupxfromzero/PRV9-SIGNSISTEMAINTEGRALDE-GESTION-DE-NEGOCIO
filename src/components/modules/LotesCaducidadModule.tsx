import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ProductBatch } from "../../types";
import {
  Boxes,
  Plus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Calendar,
  Search,
  Filter,
  Download,
  Trash2,
  Clock,
  Sparkles,
} from "lucide-react";

export const LotesCaducidadModule: React.FC = () => {
  const { batches, products, suppliers, addBatch, deleteBatch, setActiveModule } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("TODOS");
  const [showAddModal, setShowAddModal] = useState(false);

  // New batch form state
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");
  const [batchNumber, setBatchNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [quantity, setQuantity] = useState(10);
  const [cost, setCost] = useState(50);
  const [supplierName, setSupplierName] = useState(suppliers[0]?.companyName || "");

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod || !batchNumber || !expirationDate) return;

    addBatch({
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      batchNumber,
      expirationDate,
      quantity: Number(quantity),
      initialQuantity: Number(quantity),
      cost: Number(cost),
      supplierName,
      receivedDate: new Date().toISOString().split("T")[0],
    });

    setBatchNumber("");
    setExpirationDate("");
    setShowAddModal(false);
  };

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.sku.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "TODOS") return matchesSearch;
    return matchesSearch && b.status === filterStatus;
  });

  const getDaysRemaining = (expDateStr: string) => {
    const exp = new Date(expDateStr);
    const now = new Date();
    const diffTime = exp.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const totalPorCaducar = batches.filter((b) => b.status === "POR_CADUCAR").length;
  const totalCaducados = batches.filter((b) => b.status === "CADUCADO").length;
  const totalActivos = batches.filter((b) => b.status === "ACTIVO").length;

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-amber-400" /> Control de Lotes y Fechas de Caducidad (FIFO)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitoreo preventivo de productos perecederos, alertas automáticas de vencimiento y trazabilidad por lote.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Registrar Nuevo Lote
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-emerald-500/30 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Lotes Vigentes (Ok)</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{totalActivos}</div>
          <span className="text-[11px] text-emerald-400 mt-1 inline-block">Sin riesgo próximo de pérdida</span>
        </div>

        <div className="bg-slate-900/80 border border-amber-500/30 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Próximos a Caducar (&lt;30 días)</span>
            <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">{totalPorCaducar}</div>
          <span className="text-[11px] text-amber-300 mt-1 inline-block">Sugerencia: Aplicar descuento o remate</span>
        </div>

        <div className="bg-slate-900/80 border border-rose-500/30 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Lotes Caducados</span>
            <XCircle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 mt-2">{totalCaducados}</div>
          <span className="text-[11px] text-rose-300 mt-1 inline-block">Retirar del área de exhibición</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por lote, producto o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
            {["TODOS", "ACTIVO", "POR_CADUCAR", "CADUCADO"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  filterStatus === status
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {status === "POR_CADUCAR" ? "Por Caducar" : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="p-3.5">Número de Lote</th>
                <th className="p-3.5">Producto & SKU</th>
                <th className="p-3.5">Fecha Caducidad</th>
                <th className="p-3.5 text-center">Días Restantes</th>
                <th className="p-3.5 text-right">Cant. Actual</th>
                <th className="p-3.5">Proveedor</th>
                <th className="p-3.5 text-center">Estado Semáforo</th>
                <th className="p-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No se encontraron lotes registrados con ese criterio.
                  </td>
                </tr>
              ) : (
                filteredBatches.map((b) => {
                  const daysLeft = getDaysRemaining(b.expirationDate);

                  return (
                    <tr key={b.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5 font-bold text-white flex items-center gap-2">
                        <Boxes className="w-4 h-4 text-amber-400/80 shrink-0" />
                        {b.batchNumber}
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-200">{b.productName}</div>
                        <div className="text-[10px] text-slate-500">{b.sku}</div>
                      </td>
                      <td className="p-3.5 text-slate-300 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {b.expirationDate}
                        </div>
                      </td>
                      <td className="p-3.5 text-center font-bold">
                        <span
                          className={
                            daysLeft <= 0
                              ? "text-rose-400"
                              : daysLeft <= 30
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }
                        >
                          {daysLeft <= 0 ? "Vencido" : `${daysLeft} días`}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-bold text-slate-100">
                        {b.quantity} / {b.initialQuantity} pzas
                      </td>
                      <td className="p-3.5 text-slate-400">{b.supplierName || "N/A"}</td>
                      <td className="p-3.5 text-center">
                        {b.status === "CADUCADO" ? (
                          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-[10px] inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> CADUCADO
                          </span>
                        ) : b.status === "POR_CADUCAR" ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[10px] inline-flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> POR CADUCAR
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[10px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> OK VIGENTE
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => deleteBatch(b.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition cursor-pointer"
                          title="Eliminar lote"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Batch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl text-white space-y-4">
            <h3 className="text-base font-extrabold flex items-center gap-2">
              <Boxes className="w-5 h-5 text-amber-400" /> Registrar Lote de Producto
            </h3>

            <form onSubmit={handleCreateBatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Producto Asociado</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Número de Lote (LOTE / LPN)</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. LOT-2026-08B"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Fecha de Caducidad</label>
                  <input
                    type="date"
                    required
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Cantidad Recibida</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Proveedor Originario</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="Nombre de la distribuidora"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                >
                  Guardar Lote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
