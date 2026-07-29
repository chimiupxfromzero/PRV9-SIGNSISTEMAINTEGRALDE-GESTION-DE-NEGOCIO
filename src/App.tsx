import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";

import { DashboardModule } from "./components/modules/DashboardModule";
import { POSModule } from "./components/modules/POSModule";
import { InventarioModule } from "./components/modules/InventarioModule";
import { ClientesModule } from "./components/modules/ClientesModule";
import { NominaModule } from "./components/modules/NominaModule";
import { GastosModule } from "./components/modules/GastosModule";
import { ProveedoresModule } from "./components/modules/ProveedoresModule";
import { CFDIModule } from "./components/modules/CFDIModule";
import { ReembolsosModule } from "./components/modules/ReembolsosModule";
import { UsuariosRolesModule } from "./components/modules/UsuariosRolesModule";
import { AsistenteIAModule } from "./components/modules/AsistenteIAModule";
import { ConfiguracionModule } from "./components/modules/ConfiguracionModule";
import { TemasAarixModule } from "./components/modules/TemasAarixModule";
import { LotesCaducidadModule } from "./components/modules/LotesCaducidadModule";
import { PedidosProveedoresModule } from "./components/modules/PedidosProveedoresModule";
import { CompanionMovilModule } from "./components/modules/CompanionMovilModule";

const AppContent: React.FC = () => {
  const { activeModule, themeConfig, currentTheme } = useApp();
  const theme = themeConfig?.theme || currentTheme || "frosted_glass";

  let themeBgStyle: React.CSSProperties = {};
  let ambientLight = null;

  switch (theme) {
    case "dark_pro":
      themeBgStyle = { background: "#020617" };
      break;
    case "cyber_neon":
      themeBgStyle = { background: "radial-gradient(circle at top left, #0f172a, #050b14 70%, #02040a 100%)" };
      ambientLight = (
        <>
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none translate-y-1/2" />
        </>
      );
      break;
    case "emerald_executive":
      themeBgStyle = { background: "radial-gradient(circle at top left, #064e3b, #022c22 60%, #020617 100%)" };
      ambientLight = (
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      );
      break;
    case "light_modern":
      themeBgStyle = { background: "linear-gradient(to bottom right, #f8fafc, #f1f5f9, #e2e8f0)", color: "#0f172a" };
      break;
    case "frosted_glass":
    default:
      themeBgStyle = { background: "radial-gradient(circle at top left, #1e293b, #0f172a 60%, #020617 100%)" };
      ambientLight = (
        <>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />
        </>
      );
      break;
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <DashboardModule />;
      case "pos":
        return <POSModule />;
      case "inventory":
      case "inventario":
        return <InventarioModule />;
      case "lotes_caducidad":
        return <LotesCaducidadModule />;
      case "pedidos_proveedores":
        return <PedidosProveedoresModule />;
      case "customers":
      case "clientes":
        return <ClientesModule />;
      case "payroll":
      case "nomina":
        return <NominaModule />;
      case "expenses":
      case "gastos":
        return <GastosModule />;
      case "suppliers":
      case "proveedores":
        return <ProveedoresModule />;
      case "cfdi":
        return <CFDIModule />;
      case "reimbursements":
      case "reimpresion":
      case "reembolsos":
        return <ReembolsosModule />;
      case "users":
      case "usuarios":
        return <UsuariosRolesModule />;
      case "ai_assistant":
      case "asistente_ia":
        return <AsistenteIAModule />;
      case "companion_movil":
        return <CompanionMovilModule />;
      case "config":
      case "configuracion":
        return <ConfiguracionModule />;
      case "themes":
      case "temas":
        return <TemasAarixModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div
      className={`min-h-screen text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden theme-${theme}`}
      style={themeBgStyle}
    >
      {/* Decorative ambient light blurs for theme depth */}
      {ambientLight}

      <Header />
      <div className="flex-1 flex overflow-hidden relative z-10">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
