import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Product } from "../../types";
import {
  Package,
  Plus,
  Search,
  Barcode,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  X,
  Printer,
  Check,
  Calculator,
} from "lucide-react";

export const InventarioModule: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    stockMovements,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustTargetProduct, setAdjustTargetProduct] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(1);
  const [adjustType, setAdjustType] = useState<"ENTRADA" | "SALIDA" | "AJUSTE_INVENTARIO">("ENTRADA");
  const [adjustReason, setAdjustReason] = useState("");

  const [barcodeTarget, setBarcodeTarget] = useState<Product | null>(null);

  // Product Form state
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formBarcode, setFormBarcode] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formCost, setFormCost] = useState<number>(0);
  const [formStock, setFormStock] = useState<number>(0);
  const [formMinStock, setFormMinStock] = useState<number>(5);
  const [formUnit, setFormUnit] = useState("Pza");
  const [formSatClave, setFormSatClave] = useState("50202306");

  const openNewProductModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormBarcode(`750${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    setFormCategoryId(categories[0]?.id || "");
    setFormPrice(20);
    setFormCost(12);
    setFormStock(20);
    setFormMinStock(5);
    setFormUnit("Pza");
    setFormSatClave("84111506");
    setShowProductModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSku(p.sku);
    setFormBarcode(p.barcode);
    setFormCategoryId(p.categoryId);
    setFormPrice(p.price);
    setFormCost(p.cost);
    setFormStock(p.stock);
    setFormMinStock(p.minStock);
    setFormUnit(p.unit);
    setFormSatClave(p.satClaveProdServ || "84111506");
    setShowProductModal(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: formName,
        sku: formSku,
        barcode: formBarcode,
        categoryId: formCategoryId,
        price: formPrice,
        cost: formCost,
        stock: formStock,
        minStock: formMinStock,
        unit: formUnit,
        satClaveProdServ: formSatClave,
      });
    } else {
      addProduct({
        name: formName,
        sku: formSku,
        barcode: formBarcode,
        categoryId: formCategoryId,
        price: formPrice,
        cost: formCost,
        stock: formStock,
        minStock: formMinStock,
        unit: formUnit,
        satClaveProdServ: formSatClave,
        active: true,
      });
    }
    setShowProductModal(false);
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTargetProduct) return;
    adjustStock(adjustTargetProduct.id, adjustQty, adjustType, adjustReason || "Ajuste manual de inventario");
    setShowAdjustModal(false);
    setAdjustTargetProduct(null);
    setAdjustReason("");
  };

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === "ALL" || p.categoryId === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.barcode.includes(q);
    const matchesLow = showLowStockOnly ? p.stock <= p.minStock : true;
    return matchesCategory && matchesQuery && matchesLow;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" /> Catálogo de Inventario y Almacén
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión de existencias, ajuste de kardex, etiquetas de código de barras y claves SAT.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const headers = "SKU,CodigoBarras,Nombre,Costo,Precio,Stock,StockMinimo,Unidad,ClaveSAT\n";
              const rows = products
                .map(
                  (p) =>
                    `"${p.sku}","${p.barcode}","${p.name.replace(/"/g, '""')}",${p.cost},${p.price},${p.stock},${p.minStock},"${p.unit}","${p.satClaveProdServ || "84111506"}"`
                )
                .join("\n");
              const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.setAttribute("href", url);
              link.setAttribute("download", `Inventario_PV9_${new Date().toISOString().split("T")[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Descargar Catálogo de Productos en CSV"
          >
            Exportar CSV
          </button>

          <label className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
            Importar CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  const content = event.target?.result as string;
                  if (!content) return;
                  const lines = content.split("\n").slice(1);
                  let addedCount = 0;
                  lines.forEach((line) => {
                    const parts = line.split(",").map((p) => p.replace(/^"|"$/g, "").trim());
                    if (parts.length >= 3 && parts[2]) {
                      addProduct({
                        sku: parts[0] || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
                        barcode: parts[1] || `750${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                        name: parts[2],
                        cost: parseFloat(parts[3]) || 10,
                        price: parseFloat(parts[4]) || 15,
                        stock: parseInt(parts[5]) || 10,
                        minStock: parseInt(parts[6]) || 5,
                        unit: parts[7] || "Pza",
                        satClaveProdServ: parts[8] || "84111506",
                        categoryId: categories[0]?.id || "cat-1",
                        active: true,
                      });
                      addedCount++;
                    }
                  });
                  alert(`Importación completada: Se registraron ${addedCount} productos.`);
                };
                reader.readAsText(file);
              }}
            />
          </label>

          <button
            onClick={openNewProductModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Registrar Nuevo Producto
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por Nombre, SKU o Código de Barras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
        >
          <option value="ALL">Todas las Categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className={`px-3 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
            showLowStockOnly
              ? "bg-amber-950 border-amber-500 text-amber-300"
              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Solo Stock Bajo ({products.filter((p) => p.stock <= p.minStock).length})</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">SKU / Código</th>
                <th className="p-3">Producto</th>
                <th className="p-3">Categoría</th>
                <th className="p-3 text-right">Costo</th>
                <th className="p-3 text-right">Precio Venta</th>
                <th className="p-3 text-center">Margen</th>
                <th className="p-3 text-center">Stock / Mín</th>
                <th className="p-3 text-center">SAT Clave</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((prod) => {
                const isLow = prod.stock <= prod.minStock;
                const marginPercent = prod.cost > 0 ? ((prod.price - prod.cost) / prod.cost) * 100 : 0;
                const catObj = categories.find((c) => c.id === prod.categoryId);

                return (
                  <tr key={prod.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono">
                      <div className="font-bold text-slate-200">{prod.sku}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Barcode className="w-3 h-3 text-slate-400" /> {prod.barcode}
                      </div>
                    </td>

                    <td className="p-3 font-medium text-slate-100">{prod.name}</td>

                    <td className="p-3 text-slate-400">{catObj?.name || "Sin categoría"}</td>

                    <td className="p-3 text-right font-mono">${prod.cost.toFixed(2)}</td>

                    <td className="p-3 text-right font-mono font-bold text-emerald-400">
                      ${prod.price.toFixed(2)}
                    </td>

                    <td className="p-3 text-center font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-bold">
                        +{marginPercent.toFixed(0)}%
                      </span>
                    </td>

                    <td className="p-3 text-center font-mono">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isLow
                            ? "bg-amber-950 text-amber-400 border border-amber-800/50"
                            : "bg-emerald-950 text-emerald-400"
                        }`}
                      >
                        {prod.stock} / {prod.minStock} {prod.unit}s
                      </span>
                    </td>

                    <td className="p-3 text-center font-mono text-[10px] text-slate-400">
                      {prod.satClaveProdServ || "84111506"}
                    </td>

                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => {
                          setAdjustTargetProduct(prod);
                          setShowAdjustModal(true);
                        }}
                        className="px-2 py-1 bg-amber-950 hover:bg-amber-900 border border-amber-800/60 text-amber-300 rounded-lg text-[10px] font-semibold cursor-pointer"
                        title="Ajustar Stock (Kardex)"
                      >
                        Kardex
                      </button>
                      <button
                        onClick={() => setBarcodeTarget(prod)}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Ver Código de Barras"
                      >
                        <Barcode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1 text-slate-400 hover:text-blue-400"
                        title="Editar Producto"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar ${prod.name}?`)) deleteProduct(prod.id);
                        }}
                        className="p-1 text-slate-500 hover:text-rose-400"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-100">
                {editingProduct ? "Editar Producto" : "Registrar Nuevo Producto"}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nombre del Producto</label>
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
                  <label className="block text-slate-300 font-medium mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Código de Barras</label>
                  <input
                    type="text"
                    required
                    value={formBarcode}
                    onChange={(e) => setFormBarcode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Categoría</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Unidad de Medida</label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Costo Adquisición ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formCost}
                    onChange={(e) => setFormCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Precio Venta ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono font-bold text-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Stock Mínimo</label>
                  <input
                    type="number"
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">SAT ClaveProdServ</label>
                  <input
                    type="text"
                    value={formSatClave}
                    onChange={(e) => setFormSatClave(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
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

      {/* Adjust Stock Modal */}
      {showAdjustModal && adjustTargetProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-100">
                Ajuste de Stock Kardex: {adjustTargetProduct.name}
              </h3>
              <button
                onClick={() => setShowAdjustModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">Stock Actual Registrado:</span>{" "}
                <span className="font-bold text-emerald-400 font-mono">
                  {adjustTargetProduct.stock} {adjustTargetProduct.unit}s
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tipo de Movimiento</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                >
                  <option value="ENTRADA">Entrada (+ Surtido de Proveedor)</option>
                  <option value="SALIDA">Salida (- Merma o Pérdida)</option>
                  <option value="AJUSTE_INVENTARIO">Ajuste Directo de Conteo</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono text-lg font-bold text-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Motivo u Observación</label>
                <input
                  type="text"
                  placeholder="Ej: Recepción de factura #4500 o Ajuste físico"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  Aplicar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Label Modal */}
      {barcodeTarget && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center text-white">
            <h3 className="font-bold text-slate-100 mb-2">Etiqueta de Código de Barras</h3>

            <div className="bg-white text-black p-6 rounded-xl space-y-2 shadow-inner my-4">
              <div className="font-extrabold text-sm">{barcodeTarget.name}</div>
              <div className="text-xs text-gray-600 font-mono">${barcodeTarget.price.toFixed(2)} MXN</div>
              {/* Simulated barcode bars */}
              <div className="h-12 bg-slate-900 flex items-center justify-center text-white font-mono text-[10px] tracking-widest my-2">
                |||| | ||||| || |||||| || | |||||
              </div>
              <div className="font-mono text-xs tracking-wider">{barcodeTarget.barcode}</div>
            </div>

            <button
              onClick={() => {
                window.print();
                setBarcodeTarget(null);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 mb-2"
            >
              <Printer className="w-4 h-4" /> Imprimir Etiqueta
            </button>
            <button
              onClick={() => setBarcodeTarget(null)}
              className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
