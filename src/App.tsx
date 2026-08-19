import React, { useState, useEffect, useRef } from 'react';
import { PayslipData, Currency } from './types/payroll';
import { INITIAL_PAYSLIP_DATA, SAMPLE_EMPLOYEES, CURRENCIES } from './utils/sampleData';
import { PayslipPreview } from './components/PayslipPreview';
import { CompanyEditor } from './components/CompanyEditor';
import { EmployeeEditor } from './components/EmployeeEditor';
import { SalaryEditor } from './components/SalaryEditor';
import { EmployeeDirectory } from './components/EmployeeDirectory';
import { Header } from './components/Header';
import { BatchPayRunModal } from './components/BatchPayRunModal';
import { EmailShareModal } from './components/EmailShareModal';
import { printPayslip, downloadPdfPayslip, exportPayrollCSV } from './utils/pdfExport';
import {
  User,
  DollarSign,
  Building2,
  Users,
  Eye,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'geometric_payslip_active_data_v1';
const DIRECTORY_KEY = 'geometric_payslip_directory_v1';

export default function App() {
  // Initialize state with localStorage or defaults
  const [payslipData, setPayslipData] = useState<PayslipData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved payslip data', e);
    }
    return INITIAL_PAYSLIP_DATA;
  });

  // Employee Directory state
  const [directory, setDirectory] = useState<PayslipData[]>(() => {
    try {
      const saved = localStorage.getItem(DIRECTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load employee directory', e);
    }

    // Convert initial sample employees to full PayslipData items
    return SAMPLE_EMPLOYEES.map((emp, index) => ({
      ...INITIAL_PAYSLIP_DATA,
      id: `PAY-REC-${index + 1}`,
      employee: {
        ...INITIAL_PAYSLIP_DATA.employee,
        id: emp.id,
        employeeCode: emp.employeeCode,
        fullName: emp.fullName,
        email: emp.email,
        phone: emp.phone,
        designation: emp.designation,
        department: emp.department,
        joiningDate: emp.joiningDate,
        location: emp.location,
        bankName: emp.bankName,
        bankAccount: emp.bankAccount,
        routingOrIfsc: emp.routingOrIfsc,
        taxIdNumber: emp.taxIdNumber,
        daysWorked: emp.daysWorked,
        paidLeaves: emp.paidLeaves,
        unpaidLeaves: emp.unpaidLeaves,
        overtimeHours: emp.overtimeHours,
        overtimeRatePerHour: emp.overtimeRatePerHour,
      },
      payPeriod: {
        ...INITIAL_PAYSLIP_DATA.payPeriod,
        slipNumber: `SLIP-2023-10-04${index + 1}`,
        referenceNo: `NX-0092-231${index + 1}`,
      },
      earnings: emp.earnings.map((e, idx) => ({ ...e, id: `e-${idx}` })),
      deductions: emp.deductions.map((d, idx) => ({ ...d, id: `d-${idx}` })),
    }));
  });

  // UI States
  const [activeTab, setActiveTab] = useState<'salary' | 'employee' | 'company' | 'directory'>('salary');
  const [viewMode, setViewMode] = useState<'split' | 'preview-only' | 'edit-only'>('split');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payslipData));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [payslipData]);

  useEffect(() => {
    try {
      localStorage.setItem(DIRECTORY_KEY, JSON.stringify(directory));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [directory]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Sync changes back to active slip in directory
  const handleUpdatePayslip = (updater: Partial<PayslipData> | ((prev: PayslipData) => PayslipData)) => {
    setPayslipData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      // Also update in directory if matches
      setDirectory((dirList) =>
        dirList.map((d) => (d.id === next.id ? next : d))
      );
      return next;
    });
  };

  // Directory handlers
  const handleSelectEmployee = (slip: PayslipData) => {
    setPayslipData(slip);
    showNotification(`Switched active payslip to ${slip.employee.fullName}`);
  };

  const handleAddNewEmployee = () => {
    const newCode = `EMP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newSlip: PayslipData = {
      ...payslipData,
      id: `PAY-REC-${Date.now()}`,
      employee: {
        ...payslipData.employee,
        id: `emp-${Date.now()}`,
        employeeCode: newCode,
        fullName: 'New Team Member',
        email: 'employee@company.com',
        phone: '+1 (555) 000-0000',
        designation: 'Associate Specialist',
        department: 'Operations',
        joiningDate: new Date().toISOString().slice(0, 10),
        bankName: 'National Bank',
        bankAccount: '•••• 1234',
        daysWorked: 22,
        paidLeaves: 0,
        unpaidLeaves: 0,
        overtimeHours: 0,
      },
      payPeriod: {
        ...payslipData.payPeriod,
        slipNumber: `SLIP-${Date.now().toString().slice(-6)}`,
        referenceNo: `NX-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`,
      },
      earnings: [
        { id: `e-1`, name: 'Basic Salary', amount: 5000, isTaxable: true },
        { id: `e-2`, name: 'House Rent Allowance (HRA)', amount: 1500, isTaxable: true },
        { id: `e-3`, name: 'Conveyance Allowance', amount: 300, isTaxable: false },
      ],
      deductions: [
        { id: `d-1`, name: 'Provident Fund (PF)', amount: 600, isStatutory: true },
        { id: `d-2`, name: 'Income Tax (TDS)', amount: 750, isStatutory: true },
      ],
    };

    setDirectory((prev) => [newSlip, ...prev]);
    setPayslipData(newSlip);
    setActiveTab('employee');
    showNotification('Created new employee profile');
  };

  const handleDuplicateEmployee = (slip: PayslipData) => {
    const duplicated: PayslipData = {
      ...slip,
      id: `PAY-REC-${Date.now()}`,
      employee: {
        ...slip.employee,
        id: `emp-${Date.now()}`,
        employeeCode: `EMP-${Math.floor(10000 + Math.random() * 90000)}`,
        fullName: `${slip.employee.fullName} (Copy)`,
      },
      payPeriod: {
        ...slip.payPeriod,
        slipNumber: `SLIP-${Date.now().toString().slice(-6)}`,
      },
    };
    setDirectory((prev) => [duplicated, ...prev]);
    setPayslipData(duplicated);
    showNotification(`Duplicated template for ${slip.employee.fullName}`);
  };

  const handleDeleteEmployee = (slipId: string) => {
    if (directory.length <= 1) {
      alert('Cannot delete the last remaining employee in directory.');
      return;
    }
    const remaining = directory.filter((d) => d.id !== slipId);
    setDirectory(remaining);
    if (payslipData.id === slipId) {
      setPayslipData(remaining[0]);
    }
    showNotification('Employee removed from directory');
  };

  // Currency changer
  const handleCurrencyChange = (currency: Currency) => {
    handleUpdatePayslip({ currency });
    // Also update currency for all directory members for consistency
    setDirectory((dirList) => dirList.map((d) => ({ ...d, currency })));
    showNotification(`Currency switched to ${currency.code} (${currency.symbol})`);
  };

  // Preset loader
  const handleLoadPreset = (presetName: string) => {
    let companyPreset = { ...payslipData.company };
    let earningsPreset = [...payslipData.earnings];
    let deductionsPreset = [...payslipData.deductions];

    if (presetName === 'tech') {
      companyPreset = {
        ...companyPreset,
        name: 'NEXUS CORP SOLUTIONS',
        tagline: 'Enterprise Cloud & Design Systems',
        address: '122 Innovation Drive, Tech City, 56001',
        signatoryTitle: 'Chief Financial Officer',
      };
      earningsPreset = [
        { id: 'e-1', name: 'Basic Salary', amount: 8500, isTaxable: true },
        { id: 'e-2', name: 'House Rent Allowance (HRA)', amount: 2400, isTaxable: true },
        { id: 'e-3', name: 'Conveyance Allowance', amount: 500, isTaxable: false },
        { id: 'e-4', name: 'Special Incentives', amount: 1200, isTaxable: true },
        { id: 'e-5', name: 'Quarterly Performance Bonus', amount: 2000, isBonus: true, isTaxable: true },
      ];
      deductionsPreset = [
        { id: 'd-1', name: 'Provident Fund (PF)', amount: 1020, isStatutory: true },
        { id: 'd-2', name: 'Income Tax (TDS)', amount: 1850, isStatutory: true },
        { id: 'd-3', name: 'Professional Tax', amount: 200, isStatutory: true },
        { id: 'd-4', name: 'Health Insurance', amount: 450, isStatutory: false },
      ];
    } else if (presetName === 'consulting') {
      companyPreset = {
        ...companyPreset,
        name: 'MERIDIAN STRATEGY ADVISORS',
        tagline: 'Global Management Consulting Group',
        address: '500 Park Avenue, 32nd Floor, New York, NY 10022',
        signatoryTitle: 'Managing Director & Partner',
      };
      earningsPreset = [
        { id: 'e-1', name: 'Base Consulting Retainer', amount: 12500, isTaxable: true },
        { id: 'e-2', name: 'Executive Housing Allowance', amount: 3500, isTaxable: true },
        { id: 'e-3', name: 'Travel & Per Diem Allowance', amount: 1800, isTaxable: false },
        { id: 'e-4', name: 'Project Milestone Bonus', amount: 3000, isBonus: true, isTaxable: true },
      ];
      deductionsPreset = [
        { id: 'd-1', name: '401(k) Voluntary Contribution', amount: 1500, isStatutory: true },
        { id: 'd-2', name: 'Federal & State Withholding', amount: 3800, isStatutory: true },
        { id: 'd-3', name: 'Executive Health Cover', amount: 650, isStatutory: false },
      ];
    } else if (presetName === 'healthcare') {
      companyPreset = {
        ...companyPreset,
        name: 'APEX HEALTHCARE SYSTEMS',
        tagline: 'Specialty Medical Centers & Research',
        address: '840 Medical Plaza Way, Chicago, IL 60611',
        signatoryTitle: 'Chief Medical Administrator',
      };
      earningsPreset = [
        { id: 'e-1', name: 'Clinical Base Salary', amount: 10000, isTaxable: true },
        { id: 'e-2', name: 'Specialty Medical Allowance', amount: 2200, isTaxable: true },
        { id: 'e-3', name: 'Night Shift & Emergency Duty', amount: 1400, isTaxable: true },
        { id: 'e-4', name: 'Hazard & Medical Equipment Stipend', amount: 800, isTaxable: false },
      ];
      deductionsPreset = [
        { id: 'd-1', name: 'Retirement & Pension Annuity', amount: 1200, isStatutory: true },
        { id: 'd-2', name: 'Income Tax Withholding', amount: 2300, isStatutory: true },
        { id: 'd-3', name: 'Physician Professional Liability', amount: 350, isStatutory: false },
      ];
    } else if (presetName === 'creative') {
      companyPreset = {
        ...companyPreset,
        name: 'ATELIER MONOCHROME DESIGN',
        tagline: 'Architecture, Brand & Digital Systems',
        address: '742 Design Quarter, Soho, London W1D 4ES',
        signatoryTitle: 'Creative Director & Founder',
      };
      earningsPreset = [
        { id: 'e-1', name: 'Design Lead Salary', amount: 7200, isTaxable: true },
        { id: 'e-2', name: 'Remote Studio Allowance', amount: 800, isTaxable: false },
        { id: 'e-3', name: 'Creative Software & Hardware Stipend', amount: 450, isTaxable: false },
        { id: 'e-4', name: 'Design Award Royalty Share', amount: 1500, isBonus: true, isTaxable: true },
      ];
      deductionsPreset = [
        { id: 'd-1', name: 'National Insurance (NI)', amount: 620, isStatutory: true },
        { id: 'd-2', name: 'PAYE Income Tax', amount: 1650, isStatutory: true },
        { id: 'd-3', name: 'Workplace Pension Scheme', amount: 480, isStatutory: true },
      ];
    }

    handleUpdatePayslip({
      company: companyPreset,
      earnings: earningsPreset,
      deductions: deductionsPreset,
    });
    showNotification(`Loaded ${presetName.toUpperCase()} industry compensation preset`);
  };

  const handleResetToDefault = () => {
    if (confirm('Reset to initial sample company and employee records?')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(DIRECTORY_KEY);
      setPayslipData(INITIAL_PAYSLIP_DATA);
      window.location.reload();
    }
  };

  // Export / Import JSON
  const handleExportJSON = () => {
    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      activePayslip: payslipData,
      directory: directory,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payroll_Backup_${payslipData.company.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Payroll database backup exported');
  };

  const handleImportJSON = (data: any) => {
    if (data && data.activePayslip && Array.isArray(data.directory)) {
      setPayslipData(data.activePayslip);
      setDirectory(data.directory);
      showNotification('Payroll database restored successfully!');
    } else if (data && data.earnings && data.employee) {
      setPayslipData(data);
      showNotification('Imported single payslip statement');
    }
  };

  // Direct PDF download
  const handleDownloadPDF = async () => {
    setIsDownloadingPdf(true);
    const filename = `Payslip_${payslipData.employee.employeeCode}_${payslipData.payPeriod.periodMonth.replace(/\s+/g, '_')}.pdf`;
    await downloadPdfPayslip('printable-payslip-node', filename);
    setIsDownloadingPdf(false);
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    showNotification('Payslip PDF downloaded successfully');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-slate-900 selection:text-white font-sans">
      {/* Toast notification */}
      {notification && (
        <div className="no-print fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xs shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Bar */}
      <Header
        currentCurrency={payslipData.currency}
        onCurrencyChange={handleCurrencyChange}
        onPrint={printPayslip}
        onDownloadPDF={handleDownloadPDF}
        onExportCSV={() => exportPayrollCSV(directory)}
        onOpenBatchModal={() => setIsBatchModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onLoadPreset={handleLoadPreset}
        onResetToDefault={handleResetToDefault}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isDownloadingPdf={isDownloadingPdf}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div
          className={`grid gap-8 items-start ${
            viewMode === 'split'
              ? 'grid-cols-1 lg:grid-cols-12'
              : viewMode === 'edit-only'
              ? 'grid-cols-1 max-w-4xl mx-auto'
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}
        >
          {/* ================= LEFT COLUMN: CONFIGURATION EDITOR ================= */}
          {(viewMode === 'split' || viewMode === 'edit-only') && (
            <div className={`no-print space-y-6 ${viewMode === 'split' ? 'lg:col-span-6' : 'w-full'}`}>
              {/* Tabs Navigation */}
              <div className="bg-white border border-slate-300 p-1 rounded-sm shadow-xs flex items-center justify-between gap-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('salary')}
                  className={`flex-1 py-2 px-3 rounded-xs flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === 'salary'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Salary &</span> Taxes
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('employee')}
                  className={`flex-1 py-2 px-3 rounded-xs flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === 'employee'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Employee</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('company')}
                  className={`flex-1 py-2 px-3 rounded-xs flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === 'company'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Company</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('directory')}
                  className={`flex-1 py-2 px-3 rounded-xs flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === 'directory'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Directory ({directory.length})</span>
                </button>
              </div>

              {/* Active Tab Panel */}
              <div className="transition-all duration-200">
                {activeTab === 'salary' && (
                  <SalaryEditor
                    currency={payslipData.currency}
                    employee={payslipData.employee}
                    earnings={payslipData.earnings}
                    deductions={payslipData.deductions}
                    employerContributions={payslipData.employerContributions}
                    showEmployerContributions={payslipData.showEmployerContributions}
                    ytd={payslipData.ytd}
                    notes={payslipData.notes}
                    confidentialityNotice={payslipData.confidentialityNotice}
                    onEarningsChange={(earnings) => handleUpdatePayslip({ earnings })}
                    onDeductionsChange={(deductions) => handleUpdatePayslip({ deductions })}
                    onEmployerContribChange={(employerContributions) =>
                      handleUpdatePayslip({ employerContributions })
                    }
                    onShowEmployerContribChange={(showEmployerContributions) =>
                      handleUpdatePayslip({ showEmployerContributions })
                    }
                    onYtdChange={(ytd) => handleUpdatePayslip({ ytd })}
                    onNotesChange={(notes) => handleUpdatePayslip({ notes })}
                    onNoticeChange={(confidentialityNotice) =>
                      handleUpdatePayslip({ confidentialityNotice })
                    }
                  />
                )}

                {activeTab === 'employee' && (
                  <EmployeeEditor
                    employee={payslipData.employee}
                    payPeriod={payslipData.payPeriod}
                    onEmployeeChange={(employee) => handleUpdatePayslip({ employee })}
                    onPayPeriodChange={(payPeriod) => handleUpdatePayslip({ payPeriod })}
                  />
                )}

                {activeTab === 'company' && (
                  <CompanyEditor
                    company={payslipData.company}
                    onChange={(company) => handleUpdatePayslip({ company })}
                  />
                )}

                {activeTab === 'directory' && (
                  <EmployeeDirectory
                    directory={directory}
                    activeSlipId={payslipData.id}
                    onSelectEmployee={handleSelectEmployee}
                    onAddNewEmployee={handleAddNewEmployee}
                    onDuplicateEmployee={handleDuplicateEmployee}
                    onDeleteEmployee={handleDeleteEmployee}
                    onOpenBatchPayRun={() => setIsBatchModalOpen(true)}
                  />
                )}
              </div>
            </div>
          )}

          {/* ================= RIGHT COLUMN: LIVE PAYSLIP PREVIEW ================= */}
          {(viewMode === 'split' || viewMode === 'preview-only') && (
            <div
              className={`space-y-4 ${
                viewMode === 'split' ? 'lg:col-span-6 lg:sticky lg:top-24' : 'w-full'
              }`}
            >
              {/* Preview Toolbar */}
              <div className="no-print bg-slate-900 text-white px-4 py-2 rounded-sm shadow-xs flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-mono font-bold uppercase tracking-wider text-[11px]">
                    Live Statement Output
                  </span>
                  <span className="text-slate-400 hidden sm:inline font-mono">
                    [{payslipData.employee.employeeCode}]
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-800 rounded-xs px-1 text-slate-300">
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                      title="Zoom Out"
                      className="p-1 hover:text-white"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-1.5 font-mono text-[10px] font-bold">{zoomLevel}%</span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                      title="Zoom In"
                      className="p-1 hover:text-white"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setViewMode((m) => (m === 'preview-only' ? 'split' : 'preview-only'))
                    }
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xs transition-colors"
                    title={viewMode === 'preview-only' ? 'Restore Split View' : 'Full Screen Preview'}
                  >
                    {viewMode === 'preview-only' ? (
                      <Minimize2 className="w-3.5 h-3.5" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Scalable Container */}
              <div className="overflow-x-auto pb-4 pt-1 flex justify-center">
                <div
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'top center',
                    width: '100%',
                  }}
                  className="transition-transform duration-150"
                >
                  <PayslipPreview data={payslipData} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Batch Pay Run Modal */}
      <BatchPayRunModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        payslips={directory}
      />

      {/* Email / Share Modal */}
      <EmailShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        payslip={payslipData}
      />
    </div>
  );
}
