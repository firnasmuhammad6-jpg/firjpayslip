import React, { useState } from 'react';
import {
  EarningItem,
  DeductionItem,
  EmployerContribution,
  YtdSummary,
  Currency,
  EmployeeDetails,
} from '../types/payroll';
import {
  Plus,
  Trash2,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Percent,
  Calculator,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface SalaryEditorProps {
  currency: Currency;
  employee: EmployeeDetails;
  earnings: EarningItem[];
  deductions: DeductionItem[];
  employerContributions: EmployerContribution[];
  showEmployerContributions: boolean;
  ytd: YtdSummary;
  notes: string;
  confidentialityNotice: string;
  onEarningsChange: (items: EarningItem[]) => void;
  onDeductionsChange: (items: DeductionItem[]) => void;
  onEmployerContribChange: (items: EmployerContribution[]) => void;
  onShowEmployerContribChange: (show: boolean) => void;
  onYtdChange: (ytd: YtdSummary) => void;
  onNotesChange: (notes: string) => void;
  onNoticeChange: (notice: string) => void;
}

export const SalaryEditor: React.FC<SalaryEditorProps> = ({
  currency,
  employee,
  earnings,
  deductions,
  employerContributions,
  showEmployerContributions,
  ytd,
  notes,
  confidentialityNotice,
  onEarningsChange,
  onDeductionsChange,
  onEmployerContribChange,
  onShowEmployerContribChange,
  onYtdChange,
  onNotesChange,
  onNoticeChange,
}) => {
  const [quickGrossInput, setQuickGrossInput] = useState<string>('');
  const [showAutoBuilder, setShowAutoBuilder] = useState<boolean>(false);

  // Totals
  const grossEarnings = earnings.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalDeductions = deductions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const netPay = Math.max(0, grossEarnings - totalDeductions);

  // Earning operations
  const handleAddEarning = () => {
    const newItem: EarningItem = {
      id: `e-${Date.now()}`,
      name: 'Special Allowance',
      amount: 500,
      isTaxable: true,
      type: 'fixed',
    };
    onEarningsChange([...earnings, newItem]);
  };

  const handleUpdateEarning = (id: string, field: keyof EarningItem, val: any) => {
    const updated = earnings.map((item) =>
      item.id === id ? { ...item, [field]: val } : item
    );
    onEarningsChange(updated);
  };

  const handleDeleteEarning = (id: string) => {
    onEarningsChange(earnings.filter((item) => item.id !== id));
  };

  // Deduction operations
  const handleAddDeduction = () => {
    const newItem: DeductionItem = {
      id: `d-${Date.now()}`,
      name: 'Other Deduction',
      amount: 100,
      isStatutory: false,
      type: 'fixed',
    };
    onDeductionsChange([...deductions, newItem]);
  };

  const handleUpdateDeduction = (id: string, field: keyof DeductionItem, val: any) => {
    const updated = deductions.map((item) =>
      item.id === id ? { ...item, [field]: val } : item
    );
    onDeductionsChange(updated);
  };

  const handleDeleteDeduction = (id: string) => {
    onDeductionsChange(deductions.filter((item) => item.id !== id));
  };

  // Employer Contribution operations
  const handleAddEmployerContrib = () => {
    const newItem: EmployerContribution = {
      id: `ec-${Date.now()}`,
      name: 'Pension / 401(k) Match',
      amount: 500,
    };
    onEmployerContribChange([...employerContributions, newItem]);
  };

  const handleUpdateEmployerContrib = (id: string, field: keyof EmployerContribution, val: any) => {
    const updated = employerContributions.map((item) =>
      item.id === id ? { ...item, [field]: val } : item
    );
    onEmployerContribChange(updated);
  };

  const handleDeleteEmployerContrib = (id: string) => {
    onEmployerContribChange(employerContributions.filter((item) => item.id !== id));
  };

  // Quick Auto Structure Formula
  const handleApplySalaryStructure = (targetGross: number) => {
    if (isNaN(targetGross) || targetGross <= 0) return;

    // Standard Professional breakdown:
    // 50% Basic, 30% HRA, 8% Conveyance, 12% Special Allowance
    const basic = Math.round(targetGross * 0.5);
    const hra = Math.round(targetGross * 0.3);
    const conveyance = Math.round(targetGross * 0.08);
    const special = targetGross - (basic + hra + conveyance);

    const newEarnings: EarningItem[] = [
      { id: `e-1`, name: 'Basic Salary', amount: basic, isTaxable: true },
      { id: `e-2`, name: 'House Rent Allowance (HRA)', amount: hra, isTaxable: true },
      { id: `e-3`, name: 'Conveyance Allowance', amount: conveyance, isTaxable: false },
      { id: `e-4`, name: 'Special Allowance', amount: special, isTaxable: true },
    ];

    // Auto calculate PF (12% of basic) and standard estimated tax (~15%)
    const pf = Math.round(basic * 0.12);
    const tax = Math.round(targetGross * 0.14);
    const profTax = 200;
    const insurance = 350;

    const newDeductions: DeductionItem[] = [
      { id: `d-1`, name: 'Provident Fund (PF) / 401(k)', amount: pf, isStatutory: true },
      { id: `d-2`, name: 'Income Tax (TDS)', amount: tax, isStatutory: true },
      { id: `d-3`, name: 'Professional Tax', amount: profTax, isStatutory: true },
      { id: `d-4`, name: 'Medical Insurance', amount: insurance, isStatutory: false },
    ];

    onEarningsChange(newEarnings);
    onDeductionsChange(newDeductions);
    setShowAutoBuilder(false);
  };

  // Auto-add LOP (Loss of pay) if unpaid leaves > 0
  const handleApplyLossOfPay = () => {
    if (!employee.unpaidLeaves || employee.unpaidLeaves <= 0) return;
    const basic = earnings.find((e) => e.name.toLowerCase().includes('basic'))?.amount || (grossEarnings * 0.5);
    const perDay = basic / (employee.daysInMonth || 30);
    const lopAmount = Math.round(perDay * employee.unpaidLeaves);

    const exists = deductions.find((d) => d.name.toLowerCase().includes('loss of pay') || d.name.toLowerCase().includes('lop'));
    if (exists) {
      handleUpdateDeduction(exists.id, 'amount', lopAmount);
    } else {
      onDeductionsChange([
        ...deductions,
        {
          id: `d-lop-${Date.now()}`,
          name: `Loss of Pay (${employee.unpaidLeaves} days unpaid)`,
          amount: lopAmount,
          isStatutory: false,
        },
      ]);
    }
  };

  // Auto-add Overtime earning
  const handleApplyOvertime = () => {
    if (!employee.overtimeHours || employee.overtimeHours <= 0) return;
    const otAmount = Math.round(employee.overtimeHours * (employee.overtimeRatePerHour || 50));
    const exists = earnings.find((e) => e.name.toLowerCase().includes('overtime'));
    if (exists) {
      handleUpdateEarning(exists.id, 'amount', otAmount);
    } else {
      onEarningsChange([
        ...earnings,
        {
          id: `e-ot-${Date.now()}`,
          name: `Overtime Pay (${employee.overtimeHours} hrs @ ${currency.symbol}${employee.overtimeRatePerHour || 50}/hr)`,
          amount: otAmount,
          isTaxable: true,
          isBonus: true,
        },
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Summary Strip */}
      <div className="bg-slate-900 text-white p-4 rounded-sm shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 block">
              Gross Earnings
            </span>
            <span className="text-lg font-bold font-mono text-emerald-400">
              {currency.symbol}{grossEarnings.toLocaleString()}
            </span>
          </div>
          <div className="text-slate-600 font-light text-xl">−</div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 block">
              Total Deductions
            </span>
            <span className="text-lg font-bold font-mono text-red-400">
              {currency.symbol}{totalDeductions.toLocaleString()}
            </span>
          </div>
          <div className="text-slate-600 font-light text-xl">=</div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-slate-300 block font-bold">
              Net Payable
            </span>
            <span className="text-2xl font-black font-mono text-white">
              {currency.symbol}{netPay.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAutoBuilder(!showAutoBuilder)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Structure Builder
          </button>
        </div>
      </div>

      {/* Auto Structure Popup */}
      {showAutoBuilder && (
        <div className="bg-slate-50 border border-slate-300 p-4 rounded-sm space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-slate-700" />
              Standard Salary Structure Auto-Generator
            </h4>
            <span className="text-[10px] text-slate-500">50% Basic • 30% HRA • 8% Conveyance • 12% Special</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-500 font-mono">
                  {currency.symbol}
                </span>
                <input
                  type="number"
                  value={quickGrossInput}
                  onChange={(e) => setQuickGrossInput(e.target.value)}
                  placeholder="Enter Target Monthly Gross (e.g. 10000)"
                  className="w-full pl-8 pr-3 py-1.5 text-xs font-mono font-bold border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 bg-white"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleApplySalaryStructure(Number(quickGrossInput))}
              disabled={!quickGrossInput}
              className="px-4 py-1.5 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 text-xs font-bold uppercase tracking-wider rounded-xs"
            >
              Generate Structure
            </button>
          </div>
        </div>
      )}

      {/* Smart Helpers Bar */}
      {(employee.unpaidLeaves > 0 || employee.overtimeHours > 0) && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xs flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900">
          <span className="font-semibold flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-700" />
            Detected Attendance Variations:
          </span>
          <div className="flex items-center gap-2">
            {employee.unpaidLeaves > 0 && (
              <button
                type="button"
                onClick={handleApplyLossOfPay}
                className="px-2.5 py-1 bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 font-semibold text-[11px] rounded-xs"
              >
                + Calculate LOP for {employee.unpaidLeaves} unpaid day(s)
              </button>
            )}
            {employee.overtimeHours > 0 && (
              <button
                type="button"
                onClick={handleApplyOvertime}
                className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-semibold text-[11px] rounded-xs"
              >
                + Add OT Pay ({employee.overtimeHours} hrs)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Two Column Grid for Earnings and Deductions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EARNINGS TABLE */}
        <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-700 text-white flex items-center justify-center rounded-xs text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Earnings & Allowances
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-700">
                {currency.symbol}{grossEarnings.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              {earnings.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xs group hover:border-slate-300"
                >
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateEarning(item.id, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs font-medium border border-slate-300 rounded-xs bg-white focus:ring-1 focus:ring-slate-900"
                    placeholder="e.g. Basic Salary"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-2 top-1.5 text-[11px] font-mono text-slate-400">
                      {currency.symbol}
                    </span>
                    <input
                      type="number"
                      value={item.amount || ''}
                      onChange={(e) =>
                        handleUpdateEarning(item.id, 'amount', Number(e.target.value))
                      }
                      className="w-full pl-6 pr-2 py-1 text-xs font-mono font-bold border border-slate-300 rounded-xs bg-white text-right focus:ring-1 focus:ring-slate-900"
                      placeholder="0.00"
                      min={0}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteEarning(item.id)}
                    className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                    title="Remove earning item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddEarning}
            className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xs border border-dashed border-slate-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Earning / Allowance
          </button>
        </div>

        {/* DEDUCTIONS TABLE */}
        <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-700 text-white flex items-center justify-center rounded-xs text-xs font-bold">
                  <TrendingDown className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Deductions & Taxes
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-red-700">
                {currency.symbol}{totalDeductions.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              {deductions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xs group hover:border-slate-300"
                >
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateDeduction(item.id, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs font-medium border border-slate-300 rounded-xs bg-white focus:ring-1 focus:ring-slate-900"
                    placeholder="e.g. Income Tax"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-2 top-1.5 text-[11px] font-mono text-slate-400">
                      {currency.symbol}
                    </span>
                    <input
                      type="number"
                      value={item.amount || ''}
                      onChange={(e) =>
                        handleUpdateDeduction(item.id, 'amount', Number(e.target.value))
                      }
                      className="w-full pl-6 pr-2 py-1 text-xs font-mono font-bold border border-slate-300 rounded-xs bg-white text-right focus:ring-1 focus:ring-slate-900 text-red-600"
                      placeholder="0.00"
                      min={0}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteDeduction(item.id)}
                    className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                    title="Remove deduction item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddDeduction}
            className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xs border border-dashed border-slate-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Deduction / Tax
          </button>
        </div>
      </div>

      {/* Advanced Toggles (CTC Breakdown & YTD Summary) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employer Contributions / CTC */}
        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showEmployerContributions}
                onChange={(e) => onShowEmployerContribChange(e.target.checked)}
                className="rounded-xs border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Employer Benefits (CTC Breakdown)
              </span>
            </label>
            {showEmployerContributions && (
              <button
                type="button"
                onClick={handleAddEmployerContrib}
                className="text-[11px] text-slate-600 font-bold hover:text-slate-900"
              >
                + Add Benefit
              </button>
            )}
          </div>

          {showEmployerContributions ? (
            <div className="space-y-2">
              {employerContributions.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateEmployerContrib(item.id, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-xs"
                    placeholder="e.g. Employer 401(k) Match"
                  />
                  <input
                    type="number"
                    value={item.amount || ''}
                    onChange={(e) =>
                      handleUpdateEmployerContrib(item.id, 'amount', Number(e.target.value))
                    }
                    className="w-24 px-2 py-1 text-xs font-mono font-bold text-right border border-slate-200 rounded-xs"
                    placeholder="0"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteEmployerContrib(item.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">
              Enable to include employer-paid 401(k), health cover, or gratuity in the payslip.
            </p>
          )}
        </div>

        {/* YTD Summary */}
        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ytd.enabled}
                onChange={(e) => onYtdChange({ ...ytd, enabled: e.target.checked })}
                className="rounded-xs border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Year-To-Date (YTD) Summary
              </span>
            </label>
          </div>

          {ytd.enabled ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">YTD Gross</label>
                <input
                  type="number"
                  value={ytd.ytdGross}
                  onChange={(e) => onYtdChange({ ...ytd, ytdGross: Number(e.target.value) })}
                  className="w-full px-2 py-1 text-xs font-mono border border-slate-200 rounded-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">YTD Tax (TDS)</label>
                <input
                  type="number"
                  value={ytd.ytdTax}
                  onChange={(e) => onYtdChange({ ...ytd, ytdTax: Number(e.target.value) })}
                  className="w-full px-2 py-1 text-xs font-mono border border-slate-200 rounded-xs text-red-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">YTD Deductions</label>
                <input
                  type="number"
                  value={ytd.ytdDeductions}
                  onChange={(e) => onYtdChange({ ...ytd, ytdDeductions: Number(e.target.value) })}
                  className="w-full px-2 py-1 text-xs font-mono border border-slate-200 rounded-xs text-red-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">YTD Net Pay</label>
                <input
                  type="number"
                  value={ytd.ytdNet}
                  onChange={(e) => onYtdChange({ ...ytd, ytdNet: Number(e.target.value) })}
                  className="w-full px-2 py-1 text-xs font-mono font-bold border border-slate-200 rounded-xs"
                />
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">
              Enable to print cumulative fiscal year totals for tax and accounting records.
            </p>
          )}
        </div>
      </div>

      {/* Notes & Disclaimers */}
      <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Notes & Confidentiality Notices
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
              General Note / HR Remarks
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xs"
              placeholder="e.g. All statutory taxes computed under standard provisions."
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
              Confidentiality / Legal Disclaimer
            </label>
            <input
              type="text"
              value={confidentialityNotice}
              onChange={(e) => onNoticeChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xs font-mono text-[11px]"
              placeholder="e.g. This payslip is strictly confidential and private."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
