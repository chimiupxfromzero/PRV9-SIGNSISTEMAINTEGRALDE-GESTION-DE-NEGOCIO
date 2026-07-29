import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Employee, PayStub } from "../../types";
import { Briefcase, Plus, UserCheck, DollarSign, Printer, FileText, X } from "lucide-react";

export const NominaModule: React.FC = () => {
  const { employees, payStubs, addEmployee, addPayStub } = useApp();

  const [showEmpModal, setShowEmpModal] = useState(false);
  const [showStubModal, setShowStubModal] = useState(false);
  const [selectedPayStub, setSelectedPayStub] = useState<PayStub | null>(null);

  // New Employee Form
  const [empName, setEmpName] = useState("");
  const [empCurp, setEmpCurp] = useState("");
  const [empRfc, setEmpRfc] = useState("");
  const [empPosition, setEmpPosition] = useState("Cajero");
  const [empSalary, setEmpSalary] = useState<number>(4500);

  // New PayStub Form
  const [stubEmpId, setStubEmpId] = useState(employees[0]?.id || "");
  const [stubBaseSalary, setStubBaseSalary] = useState<number>(4500);
  const [stubOvertime, setStubOvertime] = useState<number>(0);
  const [stubBonuses, setStubBonuses] = useState<number>(0);
  const [stubImss, setStubImss] = useState<number>(180);
  const [stubIsr, setStubIsr] = useState<number>(220);

  const handleCreateEmp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim()) return;
    addEmployee({
      name: empName,
      curp: empCurp.toUpperCase(),
      rfc: empRfc.toUpperCase(),
      position: empPosition,
      department: "Operaciones",
      baseSalary: empSalary,
      salaryFrequency: "QUINCENAL",
      hireDate: new Date().toISOString().split("T")[0],
      active: true,
    });
    setShowEmpModal(false);
    setEmpName("");
  };

  const handleCreateStub = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === stubEmpId);
    if (!emp) return;

    const net = stubBaseSalary + stubOvertime * 75 + stubBonuses - stubImss - stubIsr;

    addPayStub({
      employeeId: emp.id,
      employeeName: emp.name,
      periodStart: "2026-07-16",
      periodEnd: "2026-07-31",
      baseSalary: stubBaseSalary,
      overtimeHours: stubOvertime,
      overtimePay: stubOvertime * 75,
      bonuses: stubBonuses,
      deductionsIMSS: stubImss,
      deductionsISR: stubIsr,
      otherDeductions: 0,
      netPay: net,
      paidDate: new Date().toISOString().split("T")[0],
      status: "PAGADO",
    });
    setShowStubModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-400" /> Nómina y Recibos de Sueldos
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Control de personal, percepciones, deducciones de ley (IMSS, ISR) y emisión de recibos.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowEmpModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" /> Registrar Empleado
          </button>
          <button
            onClick={() => setShowStubModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Generar Recibo de Nómina
          </button>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
            <UserCheck className="w-4 h-4 text-emerald-400" /> Plantilla de Empleados
          </h3>

          <div className="space-y-3">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-200">{emp.name}</div>
                  <div className="text-[10px] text-slate-400">{emp.position} | {emp.department}</div>
                  <div className="text-[10px] font-mono text-slate-500">RFC: {emp.rfc}</div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-emerald-400 font-mono">
                    ${emp.baseSalary.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400">{emp.salaryFrequency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PayStubs History */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
            <FileText className="w-4 h-4 text-blue-400" /> Historial de Recibos Emitidos
          </h3>

          <div className="space-y-3">
            {payStubs.map((stub) => (
              <div
                key={stub.id}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-200">{stub.employeeName}</div>
                  <div className="text-[10px] text-slate-400">
                    Periodo: {stub.periodStart} al {stub.periodEnd}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <div className="font-bold text-emerald-400">${stub.netPay.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-400">{stub.status}</div>
                  </div>

                  <button
                    onClick={() => setSelectedPayStub(stub)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                    title="Ver Recibo"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Employee Modal */}
      {showEmpModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-100">Registrar Empleado</h3>
              <button onClick={() => setShowEmpModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmp} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">CURP</label>
                  <input
                    type="text"
                    value={empCurp}
                    onChange={(e) => setEmpCurp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono uppercase focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">RFC</label>
                  <input
                    type="text"
                    value={empRfc}
                    onChange={(e) => setEmpRfc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono uppercase focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Puesto</label>
                  <input
                    type="text"
                    value={empPosition}
                    onChange={(e) => setEmpPosition(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Sueldo Quincenal ($)</label>
                  <input
                    type="number"
                    value={empSalary}
                    onChange={(e) => setEmpSalary(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEmpModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PayStub Generator Modal */}
      {showStubModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-100">Generar Recibo de Nómina</h3>
              <button onClick={() => setShowStubModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStub} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Empleado</label>
                <select
                  value={stubEmpId}
                  onChange={(e) => {
                    setStubEmpId(e.target.value);
                    const found = employees.find((x) => x.id === e.target.value);
                    if (found) setStubBaseSalary(found.baseSalary);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 focus:outline-none"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.position})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Sueldo Base ($)</label>
                  <input
                    type="number"
                    value={stubBaseSalary}
                    onChange={(e) => setStubBaseSalary(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Horas Extra</label>
                  <input
                    type="number"
                    value={stubOvertime}
                    onChange={(e) => setStubOvertime(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Retención IMSS ($)</label>
                  <input
                    type="number"
                    value={stubImss}
                    onChange={(e) => setStubImss(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Retención ISR ($)</label>
                  <input
                    type="number"
                    value={stubIsr}
                    onChange={(e) => setStubIsr(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowStubModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Emitir Recibo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PayStub Printable Preview */}
      {selectedPayStub && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-slate-900">
            <div className="bg-white p-6 rounded-xl font-mono text-[11px] shadow-inner space-y-2">
              <div className="text-center font-bold text-sm">RECIBO DE NÓMINA</div>
              <div className="text-center text-[10px] text-gray-600">
                PV9 ERP POS DE MEXICO
              </div>
              <div className="border-b border-dashed border-gray-400 my-2" />

              <div>Empleado: {selectedPayStub.employeeName}</div>
              <div>Periodo: {selectedPayStub.periodStart} al {selectedPayStub.periodEnd}</div>
              <div className="border-b border-dashed border-gray-400 my-2" />

              <div className="flex justify-between">
                <span>Sueldo Base:</span>
                <span>${selectedPayStub.baseSalary.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>IMSS:</span>
                <span>-${selectedPayStub.deductionsIMSS.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>ISR:</span>
                <span>-${selectedPayStub.deductionsISR.toFixed(2)}</span>
              </div>

              <div className="border-b border-dashed border-gray-400 my-2" />

              <div className="flex justify-between font-bold text-sm text-emerald-700">
                <span>NETO PAGADO:</span>
                <span>${selectedPayStub.netPay.toFixed(2)} MXN</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  window.print();
                  setSelectedPayStub(null);
                }}
                className="w-1/2 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1"
              >
                <Printer className="w-4 h-4" /> Imprimir
              </button>
              <button
                onClick={() => setSelectedPayStub(null)}
                className="w-1/2 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
