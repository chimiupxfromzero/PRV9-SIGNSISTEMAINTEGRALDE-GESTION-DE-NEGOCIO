import React from "react";
import { useApp } from "../../context/AppContext";
import {
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  Users,
  Receipt,
  FileCheck2,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export const DashboardModule: React.FC = () => {
  const {
    sales,
    products,
    customers,
    expenses,
    cfdiInvoices,
    setActiveModule,
    businessConfig,
  } = useApp();

  const todayStr = new Date().toDateString();
  const salesToday = sales.filter(
    (s) => new Date(s.timestamp).toDateString() === todayStr && s.status !== "CANCELADA"
  );
  const totalSalesToday = salesToday.reduce((sum, s) => sum + s.total, 0);

  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);
  const customersWithCredit = customers.filter((c) => c.currentCreditDebt > 0);
  const totalExpensesMonth = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingCFDI = sales.filter((s) => s.status === "COMPLETADA").length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs mb-1">
              <Sparkles className="w-4 h-4 text-blue-400" /> Resumen Ejecutivo en Tiempo Real
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Panel Principal - {businessConfig.businessName}
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1">
              Visualización central de ventas, estado del inventario y alertas operativas.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveModule("pos")}
              className="px-4 py-2.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-semibold text-xs transition backdrop-blur-md shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer border border-blue-400/30"
            >
              <ShoppingCart className="w-4 h-4" /> Ir a Punto de Venta
            </button>
            <button
              onClick={() => setActiveModule("asistente_ia")}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-indigo-200 font-semibold text-xs transition backdrop-blur-md flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" /> Consultar Asistente IA
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sales Today */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-xl transition-all hover:border-white/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Ventas de Hoy</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {businessConfig.currencySymbol}
            {totalSalesToday.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{salesToday.length} transacciones realizadas hoy</span>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div
          onClick={() => setActiveModule("inventario")}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-xl hover:border-amber-400/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Alertas de Inventario</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-300">
            {lowStockProducts.length} productos
          </div>
          <p className="text-xs text-slate-400 mt-2">Por debajo del stock mínimo recomendado</p>
        </div>

        {/* Monthly Expenses */}
        <div
          onClick={() => setActiveModule("gastos")}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-xl hover:border-rose-400/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Gastos Registrados</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {businessConfig.currencySymbol}
            {totalExpensesMonth.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-400 mt-2">{expenses.length} conceptos acumulados</p>
        </div>

        {/* Pending CFDI */}
        <div
          onClick={() => setActiveModule("cfdi")}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-xl hover:border-indigo-400/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Ventas por Facturar (CFDI 4.0)</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-indigo-300">{pendingCFDI} ventas</div>
          <p className="text-xs text-slate-400 mt-2">Listas para timbrar con SAT</p>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Sales Table */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" /> Útimas Transacciones Registradas
            </h3>
            <button
              onClick={() => setActiveModule("reimpresion")}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              Ver todas <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-2.5 rounded-l-lg">Folio</th>
                  <th className="p-2.5">Hora</th>
                  <th className="p-2.5">Cliente</th>
                  <th className="p-2.5">Pago</th>
                  <th className="p-2.5 text-right">Total</th>
                  <th className="p-2.5 text-center rounded-r-lg">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sales.slice(0, 5).map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-800/40">
                    <td className="p-2.5 font-mono font-bold text-slate-200">{sale.folio}</td>
                    <td className="p-2.5 text-slate-400">
                      {new Date(sale.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-2.5 text-slate-200 font-medium">{sale.customerName}</td>
                    <td className="p-2.5 font-mono text-slate-400">{sale.paymentMethod}</td>
                    <td className="p-2.5 font-bold text-slate-100 text-right">
                      ${sale.total.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          sale.status === "COMPLETADA"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                            : sale.status === "FACTURADA"
                            ? "bg-indigo-950 text-indigo-300 border border-indigo-800/50"
                            : "bg-rose-950 text-rose-400 border border-rose-800/50"
                        }`}
                      >
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Low Stock Warnings & Quick Credit Summary */}
        <div className="space-y-6">
          {/* Low Stock Widget */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Atención Requerida: Inventarios
            </h3>

            {lowStockProducts.length === 0 ? (
              <div className="p-4 bg-slate-950/50 rounded-xl text-center text-xs text-slate-400 italic">
                Inventario óptimo. No hay productos con stock bajo.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {lowStockProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{prod.name}</div>
                      <div className="text-[10px] text-amber-400 font-mono">
                        Actual: {prod.stock} {prod.unit}s (Mín: {prod.minStock})
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveModule("inventario")}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[10px] font-bold transition"
                    >
                      Ajustar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Credit Accounts Widget */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" /> Cuentas por Cobrar
            </h3>

            {customersWithCredit.length === 0 ? (
              <div className="p-4 bg-slate-950/50 rounded-xl text-center text-xs text-slate-400 italic">
                No hay clientes con saldo de crédito pendiente.
              </div>
            ) : (
              <div className="space-y-2">
                {customersWithCredit.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{c.name}</div>
                      <div className="text-[10px] text-slate-400">{c.rfc}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-rose-400">${c.currentCreditDebt.toFixed(2)}</div>
                      <button
                        onClick={() => setActiveModule("clientes")}
                        className="text-[10px] text-blue-400 hover:underline"
                      >
                        Gestionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
