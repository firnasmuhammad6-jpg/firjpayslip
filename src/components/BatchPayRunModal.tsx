import React, { useState } from 'react';
import { PayslipData } from '../types/payroll';
import { PayslipPreview } from './PayslipPreview';
import { printPayslip, exportPayrollCSV } from '../utils/pdfExport';
import { Printer, Download, X, CheckCircle, Users } from 'lucide-react';

interface BatchPayRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  payslips: PayslipData[];
}

export const BatchPayRunModal: React.FC<BatchPayRunModalProps> = ({
  isOpen,
  onClose,
  payslips,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'all-slips'>('summary');

  if (!isOpen) return null;

  const totalGross = payslips.reduce(
    (sum, p) => sum + p.earnings.reduce((s, e) => s + (Number(e.amount) || 0), 0),
    0
  );
  const totalDeductions = payslips.reduce(
    (sum, p) => sum + p.deductions.reduce((s, d) => s + (Number(d.amount) || 0), 0),
    0
  );
  const totalNet = totalGross - totalDeductions;
  const currencySymbol = payslips[0]?.currency.symbol || '$';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-100 border border-slate-300 w-full max-w-5xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 flex items-center justify-center rounded-xs">
              <Users className="w-4 h-4 text-slate-200" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">
                Company Monthly Payroll Run ({payslips.length} Employees)
              </h3>
              <p className="text-[11px] text-slate-400">
                Batch statement generation & compliance export
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportPayrollCSV(payslips)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export Payroll CSV
            </button>
            <button
              onClick={() => printPayslip()}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save All Slips (PDF)
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="bg-white border-b border-slate-200 px-6 pt-3 flex gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('summary')}
            className={`pb-2 border-b-2 uppercase tracking-wider transition-colors ${
              activeTab === 'summary'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Payroll Summary Table
          </button>
          <button
            onClick={() => setActiveTab('all-slips')}
            className={`pb-2 border-b-2 uppercase tracking-wider transition-colors ${
              activeTab === 'all-slips'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            All Printable Payslips ({payslips.length})
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'summary' ? (
            <>
              {/* Grand Total Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 border-l-4 border-slate-900 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
                    Total Gross Payroll
                  </span>
                  <span className="text-2xl font-black font-mono text-slate-900">
                    {currencySymbol}{totalGross.toLocaleString()}
                  </span>
                </div>
                <div className="bg-white p-4 border-l-4 border-red-500 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
                    Total Taxes & Deductions
                  </span>
                  <span className="text-2xl font-black font-mono text-red-600">
                    {currencySymbol}{totalDeductions.toLocaleString()}
                  </span>
                </div>
                <div className="bg-white p-4 border-l-4 border-emerald-600 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
                    Total Net Disbursement
                  </span>
                  <span className="text-2xl font-black font-mono text-emerald-700">
                    {currencySymbol}{totalNet.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Roster Table */}
              <div className="bg-white border border-slate-300 rounded-xs overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-mono uppercase text-[10px] tracking-wider">
                      <th className="p-3">Emp ID</th>
                      <th className="p-3">Employee Name</th>
                      <th className="p-3">Designation / Dept</th>
                      <th className="p-3">Bank Details</th>
                      <th className="p-3 text-right">Gross</th>
                      <th className="p-3 text-right">Deductions</th>
                      <th className="p-3 text-right">Net Salary</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payslips.map((slip, idx) => {
                      const gross = slip.earnings.reduce((s, e) => s + (Number(e.amount) || 0), 0);
                      const ded = slip.deductions.reduce((s, d) => s + (Number(d.amount) || 0), 0);
                      const net = gross - ded;

                      return (
                        <tr key={slip.id || idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-700">
                            {slip.employee.employeeCode}
                          </td>
                          <td className="p-3 font-bold text-slate-900">
                            {slip.employee.fullName}
                          </td>
                          <td className="p-3 text-slate-600">
                            <div>{slip.employee.designation}</div>
                            <div className="text-[10px] text-slate-400">{slip.employee.department}</div>
                          </td>
                          <td className="p-3 font-mono text-[11px] text-slate-600">
                            <div>{slip.employee.bankName}</div>
                            <div className="text-[10px] text-slate-400">{slip.employee.bankAccount}</div>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-slate-800">
                            {currencySymbol}{gross.toLocaleString()}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-red-600">
                            {currencySymbol}{ded.toLocaleString()}
                          </td>
                          <td className="p-3 text-right font-mono font-black text-slate-900 text-sm">
                            {currencySymbol}{net.toLocaleString()}
                          </td>
                          <td className="p-3 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-xs">
                              <CheckCircle className="w-3 h-3" /> Ready
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="space-y-12 print-container">
              {payslips.map((slip, idx) => (
                <div key={slip.id || idx} className="page-break-after">
                  <div className="no-print bg-slate-900 text-white px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider mb-2 flex justify-between">
                    <span>Employee #{idx + 1}: {slip.employee.fullName} ({slip.employee.employeeCode})</span>
                    <span>Slip No: {slip.payPeriod.slipNumber}</span>
                  </div>
                  <PayslipPreview data={slip} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 p-4 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-mono">
            {payslips.length} Payslip Statements Ready for Export
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xs uppercase tracking-wider"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
