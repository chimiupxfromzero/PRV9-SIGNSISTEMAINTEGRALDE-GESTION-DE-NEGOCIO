import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { User, UserRole } from "../../types";
import { Shield, Plus, UserCheck, Key, Lock, CheckCircle2, XCircle, X } from "lucide-react";

export const UsuariosRolesModule: React.FC = () => {
  const { users, rolePermissions, addUser, updateUser, updateRolePermissions } = useApp();

  const { enabledModules, toggleModuleEnabled } = useApp();

  const [activeTab, setActiveTab] = useState<"USUARIOS" | "PERMISOS" | "DESARROLLADOR">("USUARIOS");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("CAJERO");

  const openNewModal = () => {
    setEditingUser(null);
    setFormName("");
    setFormUsername("");
    setFormEmail("");
    setFormRole("CAJERO");
    setShowModal(true);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setFormName(u.name);
    setFormUsername(u.username);
    setFormEmail(u.email);
    setFormRole(u.role);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formUsername.trim()) return;

    if (editingUser) {
      updateUser({
        ...editingUser,
        name: formName,
        username: formUsername,
        email: formEmail,
        role: formRole,
      });
    } else {
      addUser({
        name: formName,
        username: formUsername,
        email: formEmail,
        role: formRole,
        active: true,
      });
    }
    setShowModal(false);
  };

  const toggleModuleForRole = (role: UserRole, moduleId: string) => {
    const current = rolePermissions[role] || [];
    const updated = current.includes(moduleId)
      ? current.filter((m) => m !== moduleId)
      : [...current, moduleId];

    updateRolePermissions(role, updated);
  };

  const allModulesList = [
    { id: "dashboard", label: "Panel de Control (Dashboard)" },
    { id: "pos", label: "Punto de Venta (POS)" },
    { id: "inventory", label: "Inventario y Almacén" },
    { id: "customers", label: "Directorio de Clientes" },
    { id: "payroll", label: "Nómina de Personal" },
    { id: "expenses", label: "Gastos Operativos" },
    { id: "suppliers", label: "Proveedores" },
    { id: "cfdi", label: "Facturación CFDI 4.0" },
    { id: "reimbursements", label: "Reembolsos" },
    { id: "users", label: "Usuarios y Roles" },
    { id: "ai_assistant", label: "Asistente IA Local" },
    { id: "config", label: "Configuración General" },
    { id: "themes", label: "Aarix UI Studio (Temas)" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" /> Control de Usuarios, Roles y Permisos Granulares
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Definición de jerarquías de acceso a cada módulo del sistema en base a los roles asignados.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nuevo Usuario
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("USUARIOS")}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "USUARIOS"
              ? "bg-blue-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          Usuarios del Sistema ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("PERMISOS")}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "PERMISOS"
              ? "bg-blue-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          Matriz de Permisos por Rol
        </button>
        <button
          onClick={() => setActiveTab("DESARROLLADOR")}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === "DESARROLLADOR"
              ? "bg-purple-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Lock className="w-4 h-4 text-purple-400" /> Panel Desarrollador (Licenciamiento)
        </button>
      </div>

      {/* TAB 1: Lista de Usuarios */}
      {activeTab === "USUARIOS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((usr) => (
            <div
              key={usr.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold uppercase">
                    {usr.role}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      usr.active ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {usr.active ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <h3 className="font-bold text-slate-100 text-sm">{usr.name}</h3>
                <div className="text-xs font-mono text-slate-400">@{usr.username}</div>
                <div className="text-xs text-slate-500">{usr.email}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => openEditModal(usr)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Editar Usuario
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Matriz de Permisos */}
      {activeTab === "PERMISOS" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Módulo del Sistema</th>
                {(["ADMINISTRADOR", "GERENTE", "CAJERO", "INVENTARISTA"] as UserRole[]).map((r) => (
                  <th key={r} className="p-3 text-center">
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {allModulesList.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-slate-200">{m.label}</td>
                  {(["ADMINISTRADOR", "GERENTE", "CAJERO", "INVENTARISTA"] as UserRole[]).map((r) => {
                    const isAllowed = (rolePermissions[r] || []).includes(m.id);
                    return (
                      <td key={r} className="p-3 text-center">
                        <button
                          onClick={() => toggleModuleForRole(r, m.id)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            isAllowed
                              ? "bg-emerald-950 text-emerald-400 hover:bg-emerald-900"
                              : "bg-slate-950 text-slate-600 hover:bg-slate-800"
                          }`}
                        >
                          {isAllowed ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: Panel Desarrollador */}
      {activeTab === "DESARROLLADOR" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 text-xs text-white">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-400" /> Control Maestro de Módulos Activos (Licenciamiento por Negocio)
            </h3>
            <p className="text-slate-400 mt-1">
              Active o desactive los módulos instalados para esta instancia del cliente. Los módulos desactivados no aparecerán en la barra lateral ni serán accesibles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allModulesList.map((m) => {
              const isModuleEnabled = enabledModules.includes(m.id as any);
              return (
                <div
                  key={m.id}
                  onClick={() => toggleModuleEnabled(m.id as any)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isModuleEnabled
                      ? "bg-purple-950/40 border-purple-500/50 text-purple-200 shadow-lg shadow-purple-950/50"
                      : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-slate-100">{m.label}</div>
                    <div className="text-[10px] font-mono mt-0.5">ID: {m.id}</div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                      isModuleEnabled ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {isModuleEnabled ? "ACTIVADO" : "BLOQUEADO"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-100">
                {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Nombre de Usuario (Login)</label>
                <input
                  type="text"
                  required
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none"
                />
              </div>

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
                <label className="block text-slate-300 font-medium mb-1">Rol Asignado</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                >
                  <option value="ADMINISTRADOR">Administrador (Acceso Total)</option>
                  <option value="GERENTE">Gerente de Tienda</option>
                  <option value="CAJERO">Cajero / Vendedor</option>
                  <option value="INVENTARISTA">Encargado de Inventarios</option>
                </select>
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
