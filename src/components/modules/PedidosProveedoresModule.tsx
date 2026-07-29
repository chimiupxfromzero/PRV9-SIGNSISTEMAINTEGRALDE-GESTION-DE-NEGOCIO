import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { PurchaseOrder, PurchaseOrderItem } from "../../types";
import {
  ClipboardList,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  PackageCheck,
  Search,
  Filter,
  Trash2,
  FileText,
  DollarSign,
  AlertCircle,
} from "lucide-react";

export const PedidosProveedoresModule: React.FC = () => {
  const {
    purchaseOrders,
    suppliers,
    products,
    addPurchaseOrder,
    updatePurchaseOrderStatus,
    receivePurchaseOrder,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("TODOS");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state for creating a Purchase Order
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || "");
  const [expectedDate, setExpectedDate] = useState(
    new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [orderItems, setOrderItems] = useState<
    Array<{ productId: string; quantity: number; unitCost: number }>
  >([
    {
      productId: products[0]?.id || "",
      quantity: 10,
      unitCost: products[0]?.cost || 50,
    },
  ]);

  const handleAddItemRow = () => {
    if (products.length === 0) return;
    setOrderItems((prev) => [
      ...prev,
      { productId: products[0].id, quantity: 10, unitCost: products[0].cost },
    ]);
  };

  const handleRemoveItemRow = (idx: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleProductChange = (idx: number, pId: string) => {
    const prod = products.find((p) => p.id === pId);
    setOrderItems((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              productId: pId,
              unitCost: prod ? prod.cost : item.unitCost,
            }
          : item
      )
    );
  };

  const handleQuantityChange = (idx: number, qty: number) => {
    setOrderItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, quantity: qty } : item))
    );
  };

  const handleCostChange = (idx: number, cost: number) => {
    setOrderItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, unitCost: cost } : item))
    );
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const supp = suppliers.find((s) => s.id === selectedSupplierId);
    if (!supp || orderItems.length === 0) return;

    const itemsFormatted: PurchaseOrderItem[] = orderItems.map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      const totalCost = item.quantity * item.unitCost;
      return {
        productId: item.productId,
        productName: prod ? prod.name : "Producto",
        sku: prod ? prod.sku : "SKU",
        quantityOrdered: item.quantity,
        quantityReceived: 0,
        unitCost: item.unitCost,
        totalCost,
      };
    });

    const subtotal = itemsFormatted.reduce((acc, i) => acc + i.totalCost, 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    addPurchaseOrder({
      supplierId: supp.id,
      supplierName: supp.companyName,
      orderDate: new Date().toISOString().split("T")[0],
      expectedDeliveryDate: expectedDate,
      status: "SOLICITADO",
      items: itemsFormatted,
      subtotal,
      tax,
      total,
      notes,
    });

    setShowCreateModal(false);
    setNotes("");
  };

  const filteredOrders = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "TODOS") return matchesSearch;
    return matchesSearch && po.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-teal-400" /> Órdenes de Compra y Pedidos a Proveedores
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión integral de reabastecimiento, recepción de mercancías y entrada automática al inventario.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Crear Órden de Compra
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por folio u proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
            {["TODOS", "SOLICITADO", "RECIBIDO", "CANCELADO"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  filterStatus === status
                    ? "bg-teal-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-slate-900/80 border border-white/10 p-8 rounded-2xl text-center text-slate-500 text-xs">
            No se encontraron órdenes de compra registradas.
          </div>
        ) : (
          filteredOrders.map((po) => (
            <div
              key={po.id}
              className="bg-slate-900 border border-white/10 p-5 rounded-2xl shadow-xl space-y-4 text-xs text-slate-300 hover:border-teal-500/30 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-white text-sm">
                        {po.folio}
                      </span>
                      <span className="text-slate-400">• {po.supplierName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-0.5">
                      <span>Solicitado: {po.orderDate}</span>
                      <span>Entrega Estimada: {po.expectedDeliveryDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full font-extrabold text-[10px] flex items-center gap-1.5 ${
                      po.status === "RECIBIDO"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : po.status === "SOLICITADO"
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-pulse"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {po.status === "RECIBIDO" ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> RECIBIDO EN ALMACÉN
                      </>
                    ) : po.status === "SOLICITADO" ? (
                      <>
                        <Clock className="w-3.5 h-3.5" /> PENDIENTE RECEPCIÓN
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> CANCELADO
                      </>
                    )}
                  </span>

                  {po.status === "SOLICITADO" && (
                    <button
                      onClick={() => receivePurchaseOrder(po.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer"
                    >
                      <PackageCheck className="w-4 h-4" /> Confirmar Recepción
                    </button>
                  )}
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] text-slate-500 uppercase">
                    <tr>
                      <th className="p-1.5">Producto</th>
                      <th className="p-1.5 text-center">Cant. Solicitada</th>
                      <th className="p-1.5 text-center">Cant. Recibida</th>
                      <th className="p-1.5 text-right">Costo Unit.</th>
                      <th className="p-1.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {po.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-1.5 font-medium text-slate-200">
                          {item.productName} <span className="text-slate-500">({item.sku})</span>
                        </td>
                        <td className="p-1.5 text-center font-bold text-white">
                          {item.quantityOrdered}
                        </td>
                        <td className="p-1.5 text-center font-bold text-emerald-400">
                          {item.quantityReceived}
                        </td>
                        <td className="p-1.5 text-right font-mono">${item.unitCost.toFixed(2)}</td>
                        <td className="p-1.5 text-right font-mono font-bold text-white">
                          ${item.totalCost.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
                <div>{po.notes && <span className="italic">Notas: {po.notes}</span>}</div>
                <div className="text-right">
                  <span className="text-slate-400">Total con IVA (16%): </span>
                  <span className="text-sm font-black text-emerald-400 font-mono ml-2">
                    ${po.total.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Purchase Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 w-full max-w-2xl shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-extrabold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-teal-400" /> Nueva Órden de Compra a Proveedor
            </h3>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Proveedor</label>
                  <select
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Fecha Promesa de Entrega</label>
                  <input
                    type="date"
                    required
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              {/* Items List inside form */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-300">Artículos a Pedir</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Artículo
                  </button>
                </div>

                {orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-white/5 items-center"
                  >
                    <div className="col-span-5">
                      <select
                        value={item.productId}
                        onChange={(e) => handleProductChange(idx, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (${p.cost})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-3">
                      <input
                        type="number"
                        min="1"
                        placeholder="Cant."
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(idx, Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white text-center"
                      />
                    </div>

                    <div className="col-span-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Costo"
                        value={item.unitCost}
                        onChange={(e) => handleCostChange(idx, Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white text-right"
                      />
                    </div>

                    <div className="col-span-1 text-right">
                      {orderItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Notas u Observaciones del Pedido</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instrucciones para el chofer o condiciones de pago..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white h-16"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-lg shadow-teal-500/20"
                >
                  Generar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
