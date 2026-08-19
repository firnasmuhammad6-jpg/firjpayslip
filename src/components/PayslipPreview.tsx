import React from 'react';
import { PayslipData } from '../types/payroll';
import { numberToWords } from '../utils/numberToWords';
import { ShieldCheck } from 'lucide-react';

interface PayslipPreviewProps {
  data: PayslipData;
  scale?: number;
  interactive?: boolean;
}

export const PayslipPreview: React.FC<PayslipPreviewProps> = ({
  data,
  interactive = false,
}) => {
  const {
    currency,
    company,
    employee,
    payPeriod,
    earnings,
    deductions,
    employerContributions,
    showEmployerContributions,
    ytd,
    notes,
    confidentialityNotice,
    templateStyle,
  } = data;

  const formatMoney = (val: number) => {
    const num = Number(val) || 0;
    return `${currency.symbol}${num.toLocaleString(currency.locale || 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const grossEarnings = earnings.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const totalDeductions = deductions.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const netSalary = Math.max(0, grossEarnings - totalDeductions);
  const totalEmployerContrib = employerContributions.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const totalCostToCompany = grossEarnings + totalEmployerContrib;

  const words = numberToWords(netSalary, currency.code);

  return (
    <div
      id="printable-payslip-node"
      className="payslip-paper w-full max-w-[850px] mx-auto bg-slate-100 font-sans text-slate-800 p-6 sm:p-10 transition-all duration-300 shadow-xl border border-slate-300 rounded-sm relative overflow-hidden"
    >
      {/* ================= HEADER ================= */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-slate-900 pb-6 mb-8 gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="w-10 h-10 object-contain rounded-sm border border-slate-300 bg-white"
              />
            ) : (
              <div className="w-10 h-10 bg-slate-900 flex items-center justify-center rounded-sm shrink-0 shadow-sm">
                <div className="w-5 h-5 border-2 border-white rotate-45"></div>
              </div>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 uppercase">
                {company.name || 'Nexus Corp Solutions'}
              </h1>
              {company.tagline && (
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                  {company.tagline}
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
            {[company.address, company.cityStateZip, company.country].filter(Boolean).join(', ')}
          </p>
          {(company.taxId || company.regNumber) && (
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              {company.taxId && <span>Tax ID: {company.taxId}</span>}
              {company.taxId && company.regNumber && <span className="mx-2">•</span>}
              {company.regNumber && <span>Reg: {company.regNumber}</span>}
            </p>
          )}
        </div>

        <div className="text-left sm:text-right w-full sm:w-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Payslip
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-widest mt-1">
            {payPeriod.periodLabel || `Statement for ${payPeriod.periodMonth}`}
          </p>
          <p className="text-[11px] font-mono text-slate-500 mt-0.5">
            Slip No: {payPeriod.slipNumber || 'SLIP-001'}
          </p>
        </div>
      </header>

      {/* ================= 3-COLUMN METADATA GRID ================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Employee Details Card */}
        <div className="bg-white p-4 sm:p-5 border-l-4 border-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Employee Details
            </p>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-tight">
              {employee.fullName || 'Employee Name'}
            </h3>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Employee ID</span>
              <span className="font-mono font-bold text-slate-700">
                {employee.employeeCode || 'EMP-10922'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Designation</span>
              <span className="font-bold text-slate-700 uppercase text-right truncate max-w-[140px]">
                {employee.designation || 'Specialist'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Department</span>
              <span className="font-bold text-slate-700 uppercase text-right truncate max-w-[140px]">
                {employee.department || 'Operations'}
              </span>
            </div>
            {employee.joiningDate && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Joining Date</span>
                <span className="font-mono text-slate-700">{employee.joiningDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Banking & Tax Card */}
        <div className="bg-white p-4 sm:p-5 border-l-4 border-slate-400 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Banking & Tax
          </p>
          <div className="space-y-1.5 mt-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Bank Account</span>
              <span className="font-mono font-bold text-slate-700">
                {employee.bankAccount || '•••• 4902'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Bank Name</span>
              <span className="font-bold text-slate-700 uppercase truncate max-w-[140px] text-right">
                {employee.bankName || 'Federal Reserve'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Tax ID / PAN</span>
              <span className="font-mono font-bold text-slate-700">
                {employee.taxIdNumber || 'BVP-928-11'}
              </span>
            </div>
            {employee.routingOrIfsc && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Routing / IFSC</span>
                <span className="font-mono text-slate-700">{employee.routingOrIfsc}</span>
              </div>
            )}
          </div>
        </div>

        {/* Time & Attendance Card */}
        <div className="bg-white p-4 sm:p-5 border-l-4 border-slate-400 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Time & Attendance
          </p>
          <div className="grid grid-cols-2 gap-2 mt-2 text-center">
            <div className="bg-slate-50 p-2 rounded-sm border border-slate-100">
              <p className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
                {employee.daysWorked ?? 22}
              </p>
              <p className="text-[9px] uppercase tracking-wider text-slate-500 font-medium">
                Days Worked
              </p>
            </div>
            <div className="bg-slate-50 p-2 rounded-sm border border-slate-100">
              <p className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
                {employee.paidLeaves ?? 2}
              </p>
              <p className="text-[9px] uppercase tracking-wider text-slate-500 font-medium">
                Paid Leaves
              </p>
            </div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-2 px-1">
            <span>Month Days: {employee.daysInMonth || 30}</span>
            {employee.unpaidLeaves > 0 && (
              <span className="text-red-600 font-semibold">Unpaid (LOP): {employee.unpaidLeaves}</span>
            )}
            {employee.overtimeHours > 0 && (
              <span className="text-emerald-700 font-semibold">OT: {employee.overtimeHours}h</span>
            )}
          </div>
        </div>
      </section>

      {/* ================= EARNINGS & DEDUCTIONS GRID ================= */}
      <main className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-300 border border-slate-300 shadow-sm mb-6">
        {/* Earnings Column */}
        <div className="bg-white p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 border-b border-slate-200 pb-3 mb-3 flex items-center justify-between">
              <span>Earnings Description</span>
              <span className="text-[10px] font-mono text-slate-400 lowercase">amount</span>
            </h4>
            <table className="w-full text-xs sm:text-sm">
              <tbody>
                {earnings.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-2 text-slate-700 font-medium">
                      <span className={item.isBonus ? 'italic font-semibold text-slate-900' : ''}>
                        {item.name}
                      </span>
                    </td>
                    <td className="py-2 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                      {formatMoney(item.amount)}
                    </td>
                  </tr>
                ))}
                {earnings.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-slate-400 italic text-xs">
                      No earnings entered
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-slate-100 flex justify-between items-center bg-slate-50/50 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Gross Earnings
            </span>
            <span className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
              {formatMoney(grossEarnings)}
            </span>
          </div>
        </div>

        {/* Deductions Column */}
        <div className="bg-slate-50 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 border-b border-slate-200 pb-3 mb-3 flex items-center justify-between">
              <span>Deductions</span>
              <span className="text-[10px] font-mono text-slate-400 lowercase">amount</span>
            </h4>
            <table className="w-full text-xs sm:text-sm">
              <tbody>
                {deductions.map((item) => (
                  <tr key={item.id} className="border-b border-slate-200/70 hover:bg-slate-100/50">
                    <td className="py-2 text-slate-700 font-medium">
                      {item.name}
                    </td>
                    <td className="py-2 text-right font-mono font-bold text-red-600 whitespace-nowrap">
                      {formatMoney(item.amount)}
                    </td>
                  </tr>
                ))}
                {deductions.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-slate-400 italic text-xs">
                      No deductions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-slate-200 flex justify-between items-center bg-slate-100/50 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Total Deductions
            </span>
            <span className="text-lg sm:text-xl font-bold text-red-700 font-mono">
              {formatMoney(totalDeductions)}
            </span>
          </div>
        </div>
      </main>

      {/* ================= OPTIONAL CTC / EMPLOYER CONTRIBUTIONS ================= */}
      {showEmployerContributions && employerContributions.length > 0 && (
        <section className="mb-6 bg-white p-4 border border-slate-300 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
              Employer Benefits & Contributions (Cost to Company)
            </h5>
            <span className="text-xs font-mono font-bold text-slate-900">
              Total CTC: {formatMoney(totalCostToCompany)}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {employerContributions.map((c) => (
              <div key={c.id} className="flex justify-between bg-slate-50 p-2 border border-slate-100">
                <span className="text-slate-600">{c.name}</span>
                <span className="font-mono font-bold text-slate-800">{formatMoney(c.amount)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= OPTIONAL YTD SUMMARY ================= */}
      {ytd.enabled && (
        <section className="mb-6 bg-white p-4 border-l-4 border-slate-700 border-y border-r border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Fiscal Year-To-Date (YTD) Summary
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-50 p-2 border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block">YTD Gross</span>
              <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                {formatMoney(ytd.ytdGross)}
              </span>
            </div>
            <div className="bg-slate-50 p-2 border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block">YTD Tax (TDS)</span>
              <span className="font-mono font-bold text-red-600 text-xs sm:text-sm">
                {formatMoney(ytd.ytdTax)}
              </span>
            </div>
            <div className="bg-slate-50 p-2 border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block">YTD Deductions</span>
              <span className="font-mono font-bold text-red-700 text-xs sm:text-sm">
                {formatMoney(ytd.ytdDeductions)}
              </span>
            </div>
            <div className="bg-slate-50 p-2 border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase block">YTD Net Pay</span>
              <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                {formatMoney(ytd.ytdNet)}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ================= FOOTER / NET PAY BANNER ================= */}
      <footer className="bg-slate-900 text-white p-6 sm:p-8 rounded-sm shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="max-w-md">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 mb-1">
            Net Payable Salary
          </p>
          <p className="text-3xl sm:text-5xl font-black font-mono tracking-tighter text-white">
            {formatMoney(netSalary)}
          </p>
          <p className="text-xs text-slate-400 italic mt-2 leading-relaxed">
            Amount in words: <span className="text-slate-200">{words}</span>
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
          {/* Employer Signature Area */}
          <div className="w-48 sm:w-56 border-b border-slate-600 pb-2 text-center flex flex-col items-center">
            {company.signatureUrl ? (
              <img
                src={company.signatureUrl}
                alt="Signature"
                className="h-10 object-contain invert brightness-200 mb-1"
              />
            ) : (
              <p className="font-serif italic text-sm text-slate-300 mb-1">
                {company.signatoryName || 'Authorized Signatory'}
              </p>
            )}
            <p className="text-[10px] uppercase font-bold text-slate-400">
              {company.signatoryTitle || 'Employer Signature'}
            </p>
          </div>

          <div className="text-left md:text-right w-full">
            <p className="text-[9px] uppercase tracking-widest text-slate-400 leading-relaxed font-mono">
              Generated on {payPeriod.paymentDate || new Date().toISOString().slice(0, 10)}
              <br />
              System Reference: {payPeriod.referenceNo || 'NX-0092-2310'}
            </p>
          </div>
        </div>
      </footer>

      {/* Notes & Security Stamp */}
      {(notes || confidentialityNotice || company.stampText) && (
        <div className="mt-4 pt-3 border-t border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] text-slate-500">
          <div className="space-y-0.5 max-w-xl">
            {notes && <p className="italic">{notes}</p>}
            {confidentialityNotice && <p className="font-mono text-[9px] text-slate-400">{confidentialityNotice}</p>}
          </div>

          {company.stampText && (
            <div className="flex items-center gap-1.5 text-slate-600 font-bold uppercase tracking-wider text-[9px] border border-slate-300 px-2.5 py-1 bg-white/70 rounded-xs shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-800" />
              <span>{company.stampText}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
