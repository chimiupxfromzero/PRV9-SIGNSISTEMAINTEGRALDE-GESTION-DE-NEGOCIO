import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Supplier } from "../../types";
import { Truck, Plus, Search, Phone, Mail, FileText, DollarSign, X } from "lucide-react";

export const ProveedoresModule: React.FC = () => {
  const { suppliers, addSupplier, updateSupplier } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Form State
  const [formCompany, setFormCompany] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRfc, setFormRfc] = useState("");
  const [formBalance, setFormBalance] = useState<number>(0);

  const openNewModal = () => {
    setEditingSupplier(null);
    setFormCompany("");
    setFormContact("");
    setFormPhone("");
    setFormEmail("");
    setFormRfc("AAA010101AAA");
    setFormBalance(0);
    setShowModal(true);
  };

  const openEditModal = (s: Supplier) => {
    setEditingSupplier(s);
    setFormCompany(s.companyName);
    setFormContact(s.contactName);
    setFormPhone(s.phone);
    setFormEmail(s.email);
    setFormRfc(s.rfc);
    setFormBalance(s.balanceDue);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany.trim()) return;

    if (editingSupplier) {
      updateSupplier({
        ...editingSupplier,
        companyName: formCompany,
        contactName: formContact,
        phone: formPhone,
        email: formEmail,
        rfc: formRfc.toUpperCase(),
        balanceDue: formBalance,
      });
    } else {
      addSupplier({
        companyName: formCompany,
        contactName: formContact,
        phone: formPhone,
        email: formEmail,
        rfc: formRfc.toUpperCase(),
        balanceDue: formBalance,
        active: true,
      });
    }
    setShowModal(false);
  };

  const filtered = suppliers.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.companyName.toLowerCase().includes(q) ||
      s.contactName.toLowerCase().includes(q) ||
      s.rfc.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-400" /> Directorio de Proveedores y Pedidos
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión de proveedores comerciales, saldos pendientes de pago y ordenamiento de surtido.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nuevo Proveedor
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por Empresa, Contacto o RFC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none"
          />
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((supp) => (
          <div
            key={supp.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold">
                  RFC: {supp.rfc}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  {supp.active ? "Activo" : "Inactivo"}
                </span>
              </div>

              <h3 className="font-bold text-slate-100 text-sm">{supp.companyName}</h3>
              <div className="text-xs text-slate-400 font-medium">Contacto: {supp.contactName}</div>

              <div className="text-xs text-slate-400 space-y-1 pt-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> {supp.phone}
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> {supp.email}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <div>
                <div className="text-[10px] text-slate-500">Saldo Pendiente de Pago:</div>
                <div
                  className={`font-mono font-bold ${
                    supp.balanceDue > 0 ? "text-rose-400" : "text-emerald-400"
                  }`}
                >
                  ${supp.balanceDue.toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => openEditModal(supp)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Supplier Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-100">
                {editingSupplier ? "Editar Proveedor" : "Registrar Proveedor"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nombre de la Empresa</label>
                <input
                  type="text"
                  required
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Contacto Principal</label>
                  <input
                    type="text"
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">RFC</label>
                  <input
                    type="text"
                    value={formRfc}
                    onChange={(e) => setFormRfc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono uppercase focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Saldo por Pagar ($ MXN)</label>
                <input
                  type="number"
                  value={formBalance}
                  onChange={(e) => setFormBalance(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none text-rose-400 font-bold"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
