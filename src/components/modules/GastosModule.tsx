import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Expense } from "../../types";
import { Receipt, Plus, Search, DollarSign, Image, Calendar, Trash2, X, Paperclip } from "lucide-react";

export const GastosModule: React.FC = () => {
  const { expenses, suppliers, addExpense, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formDesc, setFormDesc] = useState("");
  const [formCat, setFormCat] = useState<Expense["category"]>("SERVICIOS");
  const [formAmount, setFormAmount] = useState<number>(0);
  const [formMethod, setFormMethod] = useState<Expense["paymentMethod"]>("TRANSFERENCIA");
  const [formSupplierId, setFormSupplierId] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDesc.trim() || formAmount <= 0) return;

    const suppObj = suppliers.find((s) => s.id === formSupplierId);

    addExpense({
      date: new Date().toISOString().split("T")[0],
      description: formDesc,
      category: formCat,
      amount: formAmount,
      paymentMethod: formMethod,
      supplierId: suppObj?.id,
      supplierName: suppObj?.companyName,
      notes: formNotes,
      createdBy: currentUser.name,
    });

    setShowModal(false);
    setFormDesc("");
    setFormAmount(0);
  };

  const filtered = expenses.filter((e) => {
    const matchesCat = categoryFilter === "ALL" || e.category === categoryFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery = e.description.toLowerCase().includes(q) || e.folio.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const totalAmount = filtered.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-rose-400" /> Control de Gastos y Pagos Operativos
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registro de erogaciones, comprobantes adjuntos, servicios y pagos a proveedores.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Registrar Nuevo Gasto
        </button>
      </div>

      {/* Filter and Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar gasto por Folio o Descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
          >
            <option value="ALL">Todas las Categorías</option>
            <option value="RENTA">Renta de Local</option>
            <option value="SERVICIOS">Servicios (CFE, Agua, Tel)</option>
            <option value="INSUMOS">Insumos y Papelería</option>
            <option value="MANTENIMIENTO">Mantenimiento</option>
            <option value="PROVEEDORES">Pago a Proveedores</option>
            <option value="OTRO">Otros Gastos</option>
          </select>
        </div>

        {/* Total Summary */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Acumulado en Gastos</div>
            <div className="text-xl font-extrabold text-rose-400 font-mono mt-0.5">
              ${totalAmount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Folio / Fecha</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Método</th>
                <th className="p-3">Registrado Por</th>
                <th className="p-3 text-right">Monto ($ MXN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono">
                    <div className="font-bold text-slate-200">{exp.folio}</div>
                    <div className="text-[10px] text-slate-500">{exp.date}</div>
                  </td>
                  <td className="p-3 font-medium text-slate-100">{exp.description}</td>
                  <td className="p-3 font-semibold text-rose-400">{exp.category}</td>
                  <td className="p-3 font-mono text-slate-400">{exp.paymentMethod}</td>
                  <td className="p-3 text-slate-400">{exp.createdBy}</td>
                  <td className="p-3 font-bold text-rose-400 font-mono text-right">
                    ${exp.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-100">Registrar Nuevo Gasto</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Concepto / Descripción</label>
                <input
                  type="text"
                  required
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Ej: Pago de Luz CFE o Renta de local"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Categoría</label>
                  <select
                    value={formCat}
                    onChange={(e) => setFormCat(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="RENTA">Renta</option>
                    <option value="SERVICIOS">Servicios</option>
                    <option value="INSUMOS">Insumos</option>
                    <option value="MANTENIMIENTO">Mantenimiento</option>
                    <option value="PROVEEDORES">Proveedores</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Monto ($ MXN)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono text-emerald-400 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Método de Pago</label>
                <select
                  value={formMethod}
                  onChange={(e) => setFormMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                >
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="TARJETA">Tarjeta</option>
                  <option value="TRANSFERENCIA">Transferencia SPEI</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Observaciones</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Guardar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
