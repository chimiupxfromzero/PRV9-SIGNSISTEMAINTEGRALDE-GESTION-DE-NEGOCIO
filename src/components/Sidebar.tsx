import React from "react";
import { useApp } from "../context/AppContext";
import { ModuleId } from "../types";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Briefcase,
  Receipt,
  Truck,
  FileCheck2,
  Printer,
  ShieldAlert,
  Sparkles,
  Settings,
  Palette,
  CloudUpload,
  ChevronRight,
  ChevronLeft,
  Shield,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Boxes,
  ClipboardList,
  Smartphone,
} from "lucide-react";

interface MenuItem {
  id: ModuleId;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    currentUser,
    userPermissions,
    products,
    customers,
    batches,
    isSidebarCollapsed,
    toggleSidebar,
    enabledModules,
    notifications,
  } = useApp();

  const currentRolePerms = userPermissions.find(
    (p) => p.role === currentUser.role
  );
  const allowed = currentRolePerms ? currentRolePerms.allowedModules : [];

  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
  const customersWithCredit = customers.filter(
    (c) => c.currentCreditDebt > 0
  ).length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const expiringBatchesCount = batches.filter(
    (b) => b.status === "POR_CADUCAR" || b.status === "CADUCADO"
  ).length;

  const ALL_MODULES: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "pos",
      label: "Punto de Venta",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      id: "inventario",
      label: "Inventario",
      icon: <Package className="w-5 h-5" />,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
    },
    {
      id: "lotes_caducidad",
      label: "Lotes y Caducidad",
      icon: <Boxes className="w-5 h-5 text-amber-400" />,
      badge: expiringBatchesCount > 0 ? expiringBatchesCount : undefined,
    },
    {
      id: "pedidos_proveedores",
      label: "Órdenes de Compra",
      icon: <ClipboardList className="w-5 h-5 text-teal-400" />,
    },
    {
      id: "clientes",
      label: "Clientes",
      icon: <Users className="w-5 h-5" />,
      badge: customersWithCredit > 0 ? customersWithCredit : undefined,
    },
    {
      id: "nomina",
      label: "Nómina",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      id: "gastos",
      label: "Gastos y Pagos",
      icon: <Receipt className="w-5 h-5" />,
    },
    {
      id: "proveedores",
      label: "Proveedores",
      icon: <Truck className="w-5 h-5" />,
    },
    {
      id: "cfdi",
      label: "CFDI 4.0 México",
      icon: <FileCheck2 className="w-5 h-5" />,
      badge: unreadNotifs > 0 ? unreadNotifs : undefined,
    },
    {
      id: "reimpresion",
      label: "Reimpresión / Devoluciones",
      icon: <Printer className="w-5 h-5" />,
    },
    {
      id: "usuarios",
      label: "Usuarios y Roles",
      icon: <ShieldAlert className="w-5 h-5" />,
    },
    {
      id: "asistente_ia",
      label: "Asistente Aarix IA",
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
    },
    {
      id: "companion_movil",
      label: "Aarix Companion Móvil",
      icon: <Smartphone className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: "configuracion",
      label: "Configuración",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      id: "temas",
      label: "Temas Visuales",
      icon: <Palette className="w-5 h-5" />,
    },
    {
      id: "respaldos",
      label: "Respaldos Nube",
      icon: <CloudUpload className="w-5 h-5" />,
    },
  ];

  const visibleModules = ALL_MODULES.filter(
    (m) => allowed.includes(m.id) && enabledModules.includes(m.id)
  );

  return (
    <aside
      className={`${
        isSidebarCollapsed ? "w-16" : "w-64"
      } bg-white/5 backdrop-blur-xl border-r border-white/10 text-slate-300 flex flex-col shrink-0 select-none transition-all duration-300 relative`}
    >
      {/* Sidebar Collapse Toggle Bar */}
      <div className="p-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
        {!isSidebarCollapsed && (
          <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase truncate">
            Módulos Autorizados
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer mx-auto"
          title={isSidebarCollapsed ? "Expandir Menú" : "Colapsar Menú"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-blue-400" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>

      {/* Role Header Badge */}
      {!isSidebarCollapsed && (
        <div className="px-3 py-2 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2.5 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
            <Shield className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="truncate">
              <div className="text-xs font-bold text-slate-100 truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-blue-300 truncate">
                Rol: {currentRolePerms?.roleName || currentUser.role}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {visibleModules.map((mod) => {
          const isActive = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              title={isSidebarCollapsed ? mod.label : undefined}
              className={`w-full flex items-center ${
                isSidebarCollapsed ? "justify-center px-2" : "justify-between px-3"
              } py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer group ${
                isActive
                  ? "bg-blue-600/25 text-blue-200 border border-blue-500/40 backdrop-blur-md shadow-lg shadow-blue-500/10 font-semibold"
                  : "hover:bg-white/5 text-slate-300 hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`${
                    isActive
                      ? "text-blue-400"
                      : "text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  {mod.icon}
                </span>
                {!isSidebarCollapsed && <span>{mod.label}</span>}
              </div>

              {!isSidebarCollapsed && (
                <div className="flex items-center gap-1.5">
                  {mod.badge !== undefined && (
                    <span className="bg-rose-500/80 border border-rose-400/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                      {mod.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-blue-400" />}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status */}
      {!isSidebarCollapsed && (
        <div className="p-3 border-t border-white/10 text-[11px] text-slate-400 bg-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span>PV9 Core Engine</span>
            <span className="text-emerald-400 font-mono text-[10px]">
              Offline-First
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};
