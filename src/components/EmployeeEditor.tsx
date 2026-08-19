import React from 'react';
import { EmployeeDetails, PayPeriodDetails } from '../types/payroll';
import { User, Calendar, CreditCard, Clock } from 'lucide-react';

interface EmployeeEditorProps {
  employee: EmployeeDetails;
  payPeriod: PayPeriodDetails;
  onEmployeeChange: (updated: EmployeeDetails) => void;
  onPayPeriodChange: (updated: PayPeriodDetails) => void;
  onAttendanceRecalculate?: () => void;
}

export const EmployeeEditor: React.FC<EmployeeEditorProps> = ({
  employee,
  payPeriod,
  onEmployeeChange,
  onPayPeriodChange,
}) => {
  const handleEmpChange = (field: keyof EmployeeDetails, value: any) => {
    onEmployeeChange({ ...employee, [field]: value });
  };

  const handlePeriodChange = (field: keyof PayPeriodDetails, value: string) => {
    let updated = { ...payPeriod, [field]: value };
    if (field === 'periodMonth') {
      updated.periodLabel = `Statement for ${value}`;
    }
    onPayPeriodChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* 1. Pay Period & Statement Meta */}
      <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 text-white flex items-center justify-center rounded-xs text-xs font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Pay Period & Disbursement Details
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Statement Ref</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Pay Period / Month *
            </label>
            <input
              type="text"
              value={payPeriod.periodMonth}
              onChange={(e) => handlePeriodChange('periodMonth', e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900"
              placeholder="e.g. October 2024"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Payment / Release Date
            </label>
            <input
              type="date"
              value={payPeriod.paymentDate}
              onChange={(e) => handlePeriodChange('paymentDate', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Slip Reference No.
            </label>
            <input
              type="text"
              value={payPeriod.slipNumber}
              onChange={(e) => handlePeriodChange('slipNumber', e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900"
              placeholder="SLIP-2024-10-001"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Payment Method
            </label>
            <select
              value={payPeriod.paymentMethod}
              onChange={(e) => handlePeriodChange('paymentMethod', e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 bg-white"
            >
              <option value="Bank Transfer">Bank Transfer (NEFT/ACH/SEPA)</option>
              <option value="Direct Deposit">Direct Deposit</option>
              <option value="Wire Transfer">Wire Transfer (SWIFT)</option>
              <option value="Cheque">Cheque / Check</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Employee Profile */}
      <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 text-white flex items-center justify-center rounded-xs text-xs font-bold">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Employee Identity & Designation
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Personal Info</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Employee Full Name *
            </label>
            <input
              type="text"
              value={employee.fullName}
              onChange={(e) => handleEmpChange('fullName', e.target.value)}
              className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900"
              placeholder="e.g. Alexander J. Sterling"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Employee ID Code *
            </label>
            <input
              type="text"
              value={employee.employeeCode}
              onChange={(e) => handleEmpChange('employeeCode', e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono font-bold border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900"
              placeholder="EMP-10922"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Designation / Role *
            </label>
            <input
              type="text"
              value={employee.designation}
              onChange={(e) => handleEmpChange('designation', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 font-semibold"
              placeholder="e.g. Senior UX Lead"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Department
            </label>
            <input
              type="text"
              value={employee.department}
              onChange={(e) => handleEmpChange('department', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900"
              placeholder="e.g. Product Design"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Work Location / Campus
            </label>
            <input
              type="text"
              value={employee.location}
              onChange={(e) => handleEmpChange('location', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900"
              placeholder="e.g. San Francisco HQ"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Joining Date
            </label>
            <input
              type="date"
              value={employee.joiningDate}
              onChange={(e) => handleEmpChange('joiningDate', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Work Email Address
            </label>
            <input
              type="email"
              value={employee.email}
              onChange={(e) => handleEmpChange('email', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900"
              placeholder="a.sterling@company.com"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={employee.phone}
              onChange={(e) => handleEmpChange('phone', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
      </div>

      {/* 3. Banking & Tax IDs */}
      <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 text-white flex items-center justify-center rounded-xs text-xs font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Banking & Statutory Tax Identifiers
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Disbursement Account</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Bank Name
            </label>
            <input
              type="text"
              value={employee.bankName}
              onChange={(e) => handleEmpChange('bankName', e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900"
              placeholder="e.g. Federal Reserve Bank"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Bank Account / IBAN
            </label>
            <input
              type="text"
              value={employee.bankAccount}
              onChange={(e) => handleEmpChange('bankAccount', e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900"
              placeholder="•••• 4902 or Full Account"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Tax ID / PAN / SSN / NIN
            </label>
            <input
              type="text"
              value={employee.taxIdNumber}
              onChange={(e) => handleEmpChange('taxIdNumber', e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900"
              placeholder="BVP-928-11"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Routing / IFSC / SWIFT
            </label>
            <input
              type="text"
              value={employee.routingOrIfsc}
              onChange={(e) => handleEmpChange('routingOrIfsc', e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900"
              placeholder="021000021"
            />
          </div>
        </div>
      </div>

      {/* 4. Time, Leaves & Attendance */}
      <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 text-white flex items-center justify-center rounded-xs text-xs font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Time, Leaves & Attendance Log
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Monthly Log</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Total Month Days
            </label>
            <input
              type="number"
              value={employee.daysInMonth}
              onChange={(e) => handleEmpChange('daysInMonth', Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-300 rounded-xs text-center"
              min={1}
              max={31}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 text-slate-900">
              Days Worked
            </label>
            <input
              type="number"
              value={employee.daysWorked}
              onChange={(e) => handleEmpChange('daysWorked', Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-900 bg-slate-50 rounded-xs text-center"
              min={0}
              max={31}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Paid Leaves
            </label>
            <input
              type="number"
              value={employee.paidLeaves}
              onChange={(e) => handleEmpChange('paidLeaves', Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-300 rounded-xs text-center"
              min={0}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-red-600 mb-1">
              Unpaid (LOP)
            </label>
            <input
              type="number"
              value={employee.unpaidLeaves}
              onChange={(e) => handleEmpChange('unpaidLeaves', Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-red-300 bg-red-50/50 rounded-xs text-center text-red-700"
              min={0}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Overtime (Hrs)
            </label>
            <input
              type="number"
              value={employee.overtimeHours}
              onChange={(e) => handleEmpChange('overtimeHours', Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-300 rounded-xs text-center"
              min={0}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              OT Rate / Hr
            </label>
            <input
              type="number"
              value={employee.overtimeRatePerHour}
              onChange={(e) => handleEmpChange('overtimeRatePerHour', Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-xs text-center"
              min={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
