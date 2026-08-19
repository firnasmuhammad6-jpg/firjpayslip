import React, { useRef } from 'react';
import { Currency, PayslipData } from '../types/payroll';
import { CURRENCIES } from '../utils/sampleData';
import {
  Printer,
  Download,
  FileSpreadsheet,
  Share2,
  Eye,
  Edit3,
  Globe,
  RotateCcw,
  Sparkles,
  Upload,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeaderProps {
  currentCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onPrint: () => void;
  onDownloadPDF: () => void;
  onExportCSV: () => void;
  onOpenBatchModal: () => void;
  onOpenShareModal: () => void;
  onLoadPreset: (presetName: string) => void;
  onResetToDefault: () => void;
  onExportJSON: () => void;
  onImportJSON: (data: any) => void;
  viewMode: 'split' | 'preview-only' | 'edit-only';
  onViewModeChange: (mode: 'split' | 'preview-only' | 'edit-only') => void;
  isDownloadingPdf: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentCurrency,
  onCurrencyChange,
  onPrint,
  onDownloadPDF,
  onExportCSV,
  onOpenBatchModal,
  onOpenShareModal,
  onLoadPreset,
  onResetToDefault,
  onExportJSON,
  onImportJSON,
  viewMode,
  onViewModeChange,
  isDownloadingPdf,
}) => {
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          onImportJSON(parsed);
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.2 } });
        } catch (err) {
          alert('Invalid JSON payroll backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="no-print bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Geometric Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white flex items-center justify-center rounded-xs shadow-sm">
            <div className="w-4 h-4 border-2 border-slate-900 rotate-45 bg-slate-900"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight uppercase leading-tight">
                Nexus Payslip Studio
              </h1>
              <span className="bg-white/10 text-slate-300 text-[10px] font-mono px-1.5 py-0.5 rounded-xs uppercase tracking-widest">
                Enterprise
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Geometric Balance • Payroll & Compensation Suite
            </p>
          </div>
        </div>

        {/* Action Controls & Utilities */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Currency Selector */}
          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xs px-2 py-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currentCurrency.code}
              onChange={(e) => {
                const found = CURRENCIES.find((c) => c.code === e.target.value);
                if (found) onCurrencyChange(found);
              }}
              className="bg-transparent text-xs font-mono font-bold text-white outline-hidden cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Industry Preset Selector */}
          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xs px-2 py-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  onLoadPreset(e.target.value);
                  e.target.value = '';
                }
              }}
              className="bg-transparent text-xs font-semibold text-slate-200 outline-hidden cursor-pointer"
            >
              <option value="" disabled className="bg-slate-900 text-slate-400">
                Load Industry Preset...
              </option>
              <option value="tech" className="bg-slate-900 text-white">
                Tech / SaaS Corporation
              </option>
              <option value="consulting" className="bg-slate-900 text-white">
                Management Consulting
              </option>
              <option value="healthcare" className="bg-slate-900 text-white">
                Hospital & Healthcare
              </option>
              <option value="creative" className="bg-slate-900 text-white">
                Design & Digital Studio
              </option>
            </select>
          </div>

          {/* View Mode Switcher (Desktop) */}
          <div className="hidden lg:flex items-center bg-slate-800 border border-slate-700 p-0.5 rounded-xs text-xs font-semibold">
            <button
              onClick={() => onViewModeChange('split')}
              className={`px-2.5 py-1 rounded-xs flex items-center gap-1 transition-colors ${
                viewMode === 'split' ? 'bg-white text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" /> Split View
            </button>
            <button
              onClick={() => onViewModeChange('edit-only')}
              className={`px-2.5 py-1 rounded-xs flex items-center gap-1 transition-colors ${
                viewMode === 'edit-only' ? 'bg-white text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3 h-3" /> Editor
            </button>
            <button
              onClick={() => onViewModeChange('preview-only')}
              className={`px-2.5 py-1 rounded-xs flex items-center gap-1 transition-colors ${
                viewMode === 'preview-only' ? 'bg-white text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" /> Document
            </button>
          </div>

          {/* Quick Share / Email button */}
          <button
            type="button"
            onClick={onOpenShareModal}
            title="Email / Share Payslip"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xs transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* CSV Payroll Export */}
          <button
            type="button"
            onClick={onExportCSV}
            title="Export Payroll CSV"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xs transition-colors hidden sm:block"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            disabled={isDownloadingPdf}
            onClick={onDownloadPDF}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span> PDF
          </button>

          {/* Print / Save as PDF Button (Flagship) */}
          <button
            type="button"
            onClick={onPrint}
            className="px-3.5 py-1.5 bg-white text-slate-900 hover:bg-slate-200 text-xs font-black uppercase tracking-wider rounded-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-900" />
            Print Slip
          </button>
        </div>
      </div>

      {/* Secondary Ribbon: Backup / Restore / Reset */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 py-1.5 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Real-time Auto-calculated
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline font-mono">A4 Vector Print Sheet • Strict Tax Compliance</span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={jsonInputRef}
            accept=".json"
            className="hidden"
            onChange={handleJsonUpload}
          />
          <button
            type="button"
            onClick={() => jsonInputRef.current?.click()}
            className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Upload className="w-3 h-3" /> Import Backup (JSON)
          </button>
          <button
            type="button"
            onClick={onExportJSON}
            className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Download className="w-3 h-3" /> Backup (JSON)
          </button>
          <button
            type="button"
            onClick={onResetToDefault}
            className="text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>
    </header>
  );
};
