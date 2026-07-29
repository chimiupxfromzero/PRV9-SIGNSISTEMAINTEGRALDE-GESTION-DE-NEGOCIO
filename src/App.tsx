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
  const { activeModule } = useApp();

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
      className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden"
      style={{
        background: "radial-gradient(circle at top left, #1e293b, #0f172a 60%, #020617 100%)",
      }}
    >
      {/* Decorative ambient ambient light blurs for extra frosted glass depth */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

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
