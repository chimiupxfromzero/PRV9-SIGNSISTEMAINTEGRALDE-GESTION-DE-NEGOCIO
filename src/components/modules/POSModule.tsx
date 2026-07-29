import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Product, CartItem, PaymentMethod, Sale } from "../../types";
import {
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  CreditCard,
  Send,
  User,
  Printer,
  X,
  CheckCircle2,
  Receipt,
  Sparkles,
  Calculator,
  Lock,
} from "lucide-react";

export const POSModule: React.FC = () => {
  const {
    products,
    categories,
    customers,
    addSale,
    businessConfig,
    currentCorteCaja,
    openCorteCaja,
    closeCorteCaja,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("cust-gen");

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("EFECTIVO");
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  // Arqueo / Corte modal
  // Quick customer creation modal
  const [showQuickCustomerModal, setShowQuickCustomerModal] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustRfc, setNewCustRfc] = useState("XAXX010101000");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustCredit, setNewCustCredit] = useState(0);

  // CFDI Invoice Request checkbox
  const [requestFactura, setRequestFactura] = useState(false);

  // Mixed Payment Breakdown state
  const [mixedCash, setMixedCash] = useState(0);
  const [mixedCard, setMixedCard] = useState(0);
  const [mixedTransfer, setMixedTransfer] = useState(0);

  // Corte de Caja state
  const [showCorteModal, setShowCorteModal] = useState(false);
  const [initialCashInput, setInitialCashInput] = useState(500);
  const [actualCashInput, setActualCashInput] = useState(0);

  const { addCustomer, stampCFDI } = useApp();

  const handleCreateQuickCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    addCustomer({
      name: newCustName,
      rfc: newCustRfc || "XAXX010101000",
      razonSocial: newCustName.toUpperCase(),
      regimenFiscal: "616",
      postalCode: "06000",
      email: newCustEmail,
      phone: newCustPhone,
      creditLimit: newCustCredit,
    });

    setShowQuickCustomerModal(false);
    setNewCustName("");
    setNewCustEmail("");
    setNewCustPhone("");
    setNewCustCredit(0);
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "ALL" || p.categoryId === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.barcode.includes(q);
    return matchesCategory && matchesSearch && p.active;
  });

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert(`¡Atención! El producto ${product.name} no tiene stock disponible.`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.product.id === product.id);
      if (existing) {
        if (existing.quantity + 1 > product.stock) {
          alert(`No se puede agregar más de ${product.stock} unidades disponibles.`);
          return prevCart;
        }
        return prevCart.map((ci) =>
          ci.product.id === product.id
            ? {
                ...ci,
                quantity: ci.quantity + 1,
                total: (ci.quantity + 1) * ci.unitPrice * (1 - ci.discountPercent / 100),
              }
            : ci
        );
      }
      return [
        ...prevCart,
        {
          product,
          quantity: 1,
          unitPrice: product.price,
          discountPercent: 0,
          total: product.price,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.stock) {
              alert(`Stock máximo disponible: ${item.product.stock} unidades.`);
              return item;
            }
            return {
              ...item,
              quantity: newQty,
              total: newQty * item.unitPrice * (1 - item.discountPercent / 100),
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.total, 0);
  const cartSubtotal = cartTotal / (1 + businessConfig.defaultTaxIVA / 100);
  const cartIVA = cartTotal - cartSubtotal;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (paymentMethod === "EFECTIVO" && amountReceived < cartTotal) {
      alert("El monto recibido en efectivo es menor al total de la venta.");
      return;
    }

    const saleResult = addSale(cart, paymentMethod, amountReceived || cartTotal, selectedCustomerId);
    setCompletedSale(saleResult);
    setShowPaymentModal(false);
    setCart([]);
    setAmountReceived(0);
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col md:flex-row gap-4 overflow-hidden">
      {/* Left 65%: Products Browser & Search */}
      <div className="md:w-3/5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col p-4 shadow-xl overflow-hidden">
        {/* Top Search & Category Filter Bar */}
        <div className="space-y-3 mb-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar por Nombre, Código de Barras o SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => {
                if (filteredProducts.length > 0) addToCart(filteredProducts[0]);
              }}
              className="px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Escanear con lector"
            >
              <Barcode className="w-4 h-4 text-blue-400" /> Scanner
            </button>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition ${
                selectedCategory === "ALL"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              Todos ({products.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition ${
                  selectedCategory === c.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1">
          {filteredProducts.map((p) => {
            const isLow = p.stock <= p.minStock;
            return (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                className={`p-3 bg-slate-950/70 border rounded-2xl flex flex-col justify-between hover:scale-[1.02] cursor-pointer transition shadow ${
                  isLow ? "border-amber-500/40" : "border-slate-800/80 hover:border-blue-500/50"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-mono text-slate-400 truncate">{p.sku}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        p.stock > 0
                          ? isLow
                            ? "bg-amber-950 text-amber-400"
                            : "bg-emerald-950 text-emerald-400"
                          : "bg-rose-950 text-rose-400"
                      }`}
                    >
                      {p.stock} {p.unit}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-200 text-xs line-clamp-2 leading-snug">
                    {p.name}
                  </h4>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-900 flex justify-between items-center">
                  <span className="text-sm font-extrabold text-blue-400">
                    ${p.price.toFixed(2)}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right 35%: Shopping Cart & Checkout Panel */}
      <div className="md:w-2/5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col p-4 shadow-2xl">
        {/* Customer Selector & Quick Create Customer Button */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div className="flex-1 flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5">
            <User className="w-4 h-4 text-blue-400 shrink-0" />
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="bg-transparent text-xs text-slate-200 w-full focus:outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                  {c.name} ({c.rfc})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowQuickCustomerModal(true)}
            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
            title="Alta Rápida de Nuevo Cliente"
          >
            <Plus className="w-3.5 h-3.5" /> Cliente
          </button>

          <button
            onClick={() => setShowCorteModal(true)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
            title="Arqueo y Corte de Caja"
          >
            <Calculator className="w-4 h-4 text-emerald-400" /> Corte
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto my-3 space-y-2 pr-1">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs italic">
              <Receipt className="w-12 h-12 mb-2 opacity-30 text-blue-400" />
              <span>Carrito de venta vacío.</span>
              <span className="text-[10px] text-slate-600">
                Haga clic en un producto para agregarlo.
              </span>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="font-semibold text-slate-200 truncate">{item.product.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    ${item.unitPrice.toFixed(2)} c/u
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-bold text-slate-100 font-mono">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <Plus className="w-3 h-3" />
                  </button>

                  <span className="w-16 text-right font-bold text-blue-400">
                    ${item.total.toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Checkout Button */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal:</span>
            <span className="font-mono text-slate-200">${cartSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>IVA ({businessConfig.defaultTaxIVA}%):</span>
            <span className="font-mono text-slate-200">${cartIVA.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-extrabold text-base text-slate-100 pt-1 border-t border-slate-800">
            <span>TOTAL:</span>
            <span className="text-emerald-400 font-mono">${cartTotal.toFixed(2)}</span>
          </div>

          {/* Factura CFDI 4.0 Request Checkbox */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800 mt-1">
            <input
              type="checkbox"
              id="reqFactura"
              checked={requestFactura}
              onChange={(e) => setRequestFactura(e.target.checked)}
              className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
            />
            <label htmlFor="reqFactura" className="text-slate-300 font-medium text-[11px] cursor-pointer">
              Solicita Factura CFDI 4.0
            </label>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={() => {
              setAmountReceived(cartTotal);
              setShowPaymentModal(true);
            }}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-extrabold text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <DollarSign className="w-5 h-5" /> COBRAR (${cartTotal.toFixed(2)})
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" /> Procesar Pago de Venta
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "EFECTIVO", label: "Efectivo", icon: DollarSign },
                    { id: "TARJETA", label: "Tarjeta Débito/Crédito", icon: CreditCard },
                    { id: "TRANSFERENCIA", label: "Transferencia SPEI", icon: Send },
                    { id: "MIXTO", label: "Pago Mixto", icon: Calculator },
                  ].map((m) => {
                    const IconComp = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                          paymentMethod === m.id
                            ? "bg-emerald-950 border-emerald-500 text-emerald-300"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <IconComp className="w-4 h-4 text-emerald-400" /> {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount Received for Cash Change Calculation */}
              {paymentMethod === "EFECTIVO" && (
                <div className="space-y-2 bg-slate-950 p-3 border border-slate-800 rounded-xl">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Total a Pagar:</span>
                    <span className="font-mono font-bold text-slate-100">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Monto Recibido
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 text-lg font-mono font-bold text-emerald-400 px-3 py-2 rounded-xl text-right focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-slate-900">
                    <span className="text-slate-400 font-semibold">Cambio a Entregar:</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      ${Math.max(0, amountReceived - cartTotal).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30"
                >
                  Completar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket / Receipt Preview Modal */}
      {completedSale && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-slate-900">
            {/* Printable Ticket Receipt */}
            <div className="bg-white p-6 rounded-xl font-mono text-[11px] shadow-inner space-y-2">
              <div className="text-center font-bold text-sm">
                {businessConfig.businessName}
              </div>
              <div className="text-center text-[10px] text-gray-600">
                {businessConfig.address}
                <br />
                RFC: {businessConfig.rfc} | Tel: {businessConfig.phone}
              </div>
              <div className="border-b border-dashed border-gray-400 my-2" />

              <div className="flex justify-between">
                <span>Folio: {completedSale.folio}</span>
                <span>{new Date(completedSale.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <div className="text-[10px]">Cliente: {completedSale.customerName}</div>
              <div className="border-b border-dashed border-gray-400 my-2" />

              <div className="space-y-1">
                {completedSale.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.quantity}x {item.product.name.substring(0, 18)}</span>
                    <span>${item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-b border-dashed border-gray-400 my-2" />

              <div className="flex justify-between font-bold text-xs">
                <span>TOTAL:</span>
                <span>${completedSale.total.toFixed(2)} MXN</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-600">
                <span>Método de Pago:</span>
                <span>{completedSale.paymentMethod}</span>
              </div>

              <div className="text-center text-[9px] text-gray-500 pt-3 italic">
                {businessConfig.ticketFooterMessage}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  window.print();
                  setCompletedSale(null);
                }}
                className="w-1/2 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Imprimir Ticket
              </button>
              <button
                onClick={() => setCompletedSale(null)}
                className="w-1/2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Corte de Caja Modal */}
      {showCorteModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" /> Arqueo y Corte de Caja
              </h3>
              <button
                onClick={() => setShowCorteModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {currentCorteCaja ? (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estado de Caja:</span>
                    <span className="font-bold text-emerald-400">{currentCorteCaja.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Caja Inicial:</span>
                    <span className="font-mono text-slate-200">
                      ${currentCorteCaja.initialCash.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ventas en Efectivo:</span>
                    <span className="font-mono text-slate-200">
                      ${currentCorteCaja.salesCash.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ventas con Tarjeta:</span>
                    <span className="font-mono text-slate-200">
                      ${currentCorteCaja.salesCard.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-blue-400 pt-2 border-t border-slate-900">
                    <span>Total Esperado en Caja:</span>
                    <span>${currentCorteCaja.expectedTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Efectivo Real Contado en Caja
                  </label>
                  <input
                    type="number"
                    value={actualCashInput}
                    onChange={(e) => setActualCashInput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 text-lg font-mono text-emerald-400 px-3 py-2 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      closeCorteCaja(actualCashInput, "Corte de caja completado por usuario");
                      setShowCorteModal(false);
                      alert("Corte de caja cerrado exitosamente.");
                    }}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" /> Cerrar Turno / Corte de Caja
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  No hay una caja abierta actualmente. Ingrese el monto inicial para abrir la caja.
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Fondo Inicial de Caja (Efectivo)
                  </label>
                  <input
                    type="number"
                    value={initialCashInput}
                    onChange={(e) => setInitialCashInput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 text-lg font-mono text-emerald-400 px-3 py-2 rounded-xl focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    openCorteCaja(initialCashInput);
                    setShowCorteModal(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                >
                  Abrir Turno de Caja
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Quick Customer Creation Modal */}
      {showQuickCustomerModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" /> Alta Rápida de Cliente
              </h3>
              <button
                onClick={() => setShowQuickCustomerModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuickCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nombre / Razón Social</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Distribuidora del Golfo SA de CV"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">RFC</label>
                  <input
                    type="text"
                    required
                    placeholder="XAXX010101000"
                    value={newCustRfc}
                    onChange={(e) => setNewCustRfc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono uppercase focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="5551234567"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Correo Electrónico (para CFDI)</label>
                <input
                  type="email"
                  placeholder="facturacion@cliente.com"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Límite de Crédito ($ MXN)</label>
                <input
                  type="number"
                  step="500"
                  value={newCustCredit}
                  onChange={(e) => setNewCustCredit(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowQuickCustomerModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Guardar y Seleccionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
