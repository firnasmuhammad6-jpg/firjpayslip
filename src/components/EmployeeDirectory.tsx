import React, { useState } from 'react';
import { PayslipData } from '../types/payroll';
import {
  Users,
  UserPlus,
  Copy,
  Trash2,
  Check,
  Search,
  Building,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface EmployeeDirectoryProps {
  directory: PayslipData[];
  activeSlipId: string;
  onSelectEmployee: (slip: PayslipData) => void;
  onAddNewEmployee: () => void;
  onDuplicateEmployee: (slip: PayslipData) => void;
  onDeleteEmployee: (slipId: string) => void;
  onOpenBatchPayRun: () => void;
}

export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({
  directory,
  activeSlipId,
  onSelectEmployee,
  onAddNewEmployee,
  onDuplicateEmployee,
  onDeleteEmployee,
  onOpenBatchPayRun,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  // Filter departments
  const departments = ['ALL', ...Array.from(new Set(directory.map((d) => d.employee.department).filter(Boolean)))];

  const filtered = directory.filter((item) => {
    const matchesSearch =
      item.employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employee.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employee.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || item.employee.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm space-y-4">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-slate-900 text-white flex items-center justify-center rounded-xs text-xs font-bold">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Employee Directory & Roster ({directory.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Manage saved employee records, quick switch & batch pay run
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenBatchPayRun}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            Batch Pay Run ({directory.length})
          </button>
          <button
            type="button"
            onClick={onAddNewEmployee}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID code, or designation..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Dept:
          </span>
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDept(dept)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xs transition-colors whitespace-nowrap ${
                selectedDept === dept
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {filtered.map((slip) => {
          const isActive = slip.id === activeSlipId;
          const gross = slip.earnings.reduce((s, e) => s + (Number(e.amount) || 0), 0);
          const ded = slip.deductions.reduce((s, d) => s + (Number(d.amount) || 0), 0);
          const net = gross - ded;

          return (
            <div
              key={slip.id}
              onClick={() => onSelectEmployee(slip)}
              className={`p-4 border rounded-xs cursor-pointer transition-all duration-200 flex flex-col justify-between relative group ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {slip.employee.employeeCode || 'EMP-???'}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-semibold ${
                        isActive ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {slip.employee.department}
                    </span>
                  </div>

                  <h4
                    className={`text-sm font-bold leading-snug ${
                      isActive ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {slip.employee.fullName || 'Untitled Employee'}
                  </h4>
                  <p
                    className={`text-xs ${
                      isActive ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {slip.employee.designation}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[9px] uppercase tracking-widest block font-bold ${
                      isActive ? 'text-slate-400' : 'text-slate-400'
                    }`}
                  >
                    Net Pay
                  </span>
                  <span
                    className={`text-sm font-mono font-black ${
                      isActive ? 'text-emerald-400' : 'text-slate-900'
                    }`}
                  >
                    {slip.currency.symbol}
                    {net.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Bottom bar & action buttons */}
              <div
                className={`mt-4 pt-2.5 border-t flex items-center justify-between text-xs ${
                  isActive ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                <span
                  className={`text-[10px] font-mono ${
                    isActive ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  Bank: {slip.employee.bankName || 'Not Set'}
                </span>

                <div
                  className="flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onDuplicateEmployee(slip)}
                    title="Duplicate Employee as template"
                    className={`p-1 rounded-xs transition-colors ${
                      isActive
                        ? 'text-slate-300 hover:bg-white/10'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {directory.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteEmployee(slip.id)}
                      title="Delete from roster"
                      className={`p-1 rounded-xs transition-colors ${
                        isActive
                          ? 'text-red-300 hover:bg-white/10'
                          : 'text-slate-400 hover:text-red-600 hover:bg-slate-100'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectEmployee(slip)}
                    className={`ml-1 text-[11px] font-bold px-2 py-0.5 rounded-xs flex items-center gap-1 ${
                      isActive
                        ? 'bg-white text-slate-900'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Check className="w-3 h-3" /> Active
                      </>
                    ) : (
                      <>
                        Edit <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-2 py-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xs">
            <p className="text-xs text-slate-500 font-medium">No employees found matching filter</p>
            <button
              type="button"
              onClick={onAddNewEmployee}
              className="mt-2 text-xs font-bold text-slate-900 underline uppercase tracking-wider"
            >
              Add New Employee
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
