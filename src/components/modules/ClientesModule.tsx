import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Customer } from "../../types";
import { Users, Plus, Search, FileText, CreditCard, DollarSign, X, Check } from "lucide-react";

export const ClientesModule: React.FC = () => {
  const { customers, addCustomer, updateCustomer } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formRfc, setFormRfc] = useState("");
  const [formRazonSocial, setFormRazonSocial] = useState("");
  const [formRegimen, setFormRegimen] = useState("601");
  const [formPostalCode, setFormPostalCode] = useState("06000");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formUsoCFDI, setFormUsoCFDI] = useState("G03");
  const [formCreditLimit, setFormCreditLimit] = useState(5000);

  const openNewModal = () => {
    setEditingCustomer(null);
    setFormName("");
    setFormRfc("XAXX010101000");
    setFormRazonSocial("");
    setFormRegimen("612");
    setFormPostalCode("06000");
    setFormEmail("");
    setFormPhone("");
    setFormAddress("");
    setFormUsoCFDI("G03");
    setFormCreditLimit(5000);
    setShowModal(true);
  };

  const openEditModal = (c: Customer) => {
    setEditingCustomer(c);
    setFormName(c.name);
    setFormRfc(c.rfc);
    setFormRazonSocial(c.razonSocial || c.name);
    setFormRegimen(c.regimenFiscal || "601");
    setFormPostalCode(c.postalCode || "06000");
    setFormEmail(c.email);
    setFormPhone(c.phone);
    setFormAddress(c.address || "");
    setFormUsoCFDI(c.usoCFDI || "G03");
    setFormCreditLimit(c.creditLimit);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formRfc.trim()) return;

    if (editingCustomer) {
      updateCustomer({
        ...editingCustomer,
        name: formName,
        rfc: formRfc.toUpperCase(),
        razonSocial: formRazonSocial.toUpperCase() || formName.toUpperCase(),
        regimenFiscal: formRegimen,
        postalCode: formPostalCode,
        email: formEmail,
        phone: formPhone,
        address: formAddress,
        usoCFDI: formUsoCFDI,
        creditLimit: formCreditLimit,
      });
    } else {
      addCustomer({
        name: formName,
        rfc: formRfc.toUpperCase(),
        razonSocial: formRazonSocial.toUpperCase() || formName.toUpperCase(),
        regimenFiscal: formRegimen,
        postalCode: formPostalCode,
        email: formEmail,
        phone: formPhone,
        address: formAddress,
        usoCFDI: formUsoCFDI,
        creditLimit: formCreditLimit,
      });
    }
    setShowModal(false);
  };

  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.rfc.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" /> Directorio de Clientes y Créditos
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Administración de datos fiscales CFDI 4.0 (RFC, Régimen, CP) y límites de crédito comercial.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nuevo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por Nombre, RFC o Correo Electrónico..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cust) => (
          <div
            key={cust.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold">
                  RFC: {cust.rfc}
                </span>
                <span className="text-[10px] text-slate-400">
                  {cust.salesCount} compras realizadas
                </span>
              </div>

              <h3 className="font-bold text-slate-100 text-sm">{cust.name}</h3>

              <div className="text-xs text-slate-400 space-y-1 pt-1">
                <div>
                  <span className="text-slate-500">Razón Social:</span> {cust.razonSocial || cust.name}
                </div>
                <div>
                  <span className="text-slate-500">Régimen Fiscal:</span> {cust.regimenFiscal} | CP: {cust.postalCode}
                </div>
                <div>
                  <span className="text-slate-500">Email:</span> {cust.email || "No registrado"}
                </div>
                <div>
                  <span className="text-slate-500">Tel:</span> {cust.phone || "No registrado"}
                </div>
              </div>
            </div>

            {/* Credit Info */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <div>
                <div className="text-[10px] text-slate-500">Límite Crédito:</div>
                <div className="font-mono text-slate-200">${cust.creditLimit.toFixed(2)}</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500">Saldo Deudor:</div>
                <div className={`font-mono font-bold ${cust.currentCreditDebt > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                  ${cust.currentCreditDebt.toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => openEditModal(cust)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-100">
                {editingCustomer ? "Editar Cliente" : "Registrar Nuevo Cliente"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nombre Comercial</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">RFC Mexicano</label>
                  <input
                    type="text"
                    required
                    value={formRfc}
                    onChange={(e) => setFormRfc(e.target.value)}
                    placeholder="XAXX010101000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono uppercase focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Razón Social Fiscal</label>
                  <input
                    type="text"
                    value={formRazonSocial}
                    onChange={(e) => setFormRazonSocial(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 uppercase focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Régimen Fiscal (SAT)</label>
                  <select
                    value={formRegimen}
                    onChange={(e) => setFormRegimen(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="601">601 - General de Ley Personas Morales</option>
                    <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
                    <option value="626">626 - Régimen Simplificado de Confianza (RESICO)</option>
                    <option value="616">616 - Sin obligaciones fiscales</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Código Postal (CP)</label>
                  <input
                    type="text"
                    value={formPostalCode}
                    onChange={(e) => setFormPostalCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Teléfono de Contacto</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Límite de Crédito ($ MXN)</label>
                <input
                  type="number"
                  value={formCreditLimit}
                  onChange={(e) => setFormCreditLimit(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none text-emerald-400 font-bold"
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
                  className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
