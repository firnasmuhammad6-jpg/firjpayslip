import React, { useRef } from 'react';
import { CompanyDetails } from '../types/payroll';
import { Building2, Upload, Trash2, CheckCircle2 } from 'lucide-react';

interface CompanyEditorProps {
  company: CompanyDetails;
  onChange: (updated: CompanyDetails) => void;
}

export const CompanyEditor: React.FC<CompanyEditorProps> = ({ company, onChange }) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof CompanyDetails, value: string) => {
    onChange({ ...company, [field]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'signatureUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange({ ...company, [field]: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-5 bg-white p-5 rounded-sm border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-slate-900 text-white flex items-center justify-center rounded-xs text-xs font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
            Company & Entity Profile
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">Employer Settings</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Name */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Company / Organization Legal Name *
          </label>
          <input
            type="text"
            value={company.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-hidden font-medium"
            placeholder="e.g. NEXUS CORP SOLUTIONS"
          />
        </div>

        {/* Tagline / Subtitle */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Tagline / Business Line
          </label>
          <input
            type="text"
            value={company.tagline || ''}
            onChange={(e) => handleChange('tagline', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-hidden"
            placeholder="e.g. Enterprise Cloud & Design Systems"
          />
        </div>

        {/* Tax ID / PAN / EIN */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Tax ID / EIN / PAN / VAT
          </label>
          <input
            type="text"
            value={company.taxId}
            onChange={(e) => handleChange('taxId', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-hidden font-mono"
            placeholder="e.g. US-EIN-94-829104"
          />
        </div>

        {/* Registration Number */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Company Registration No.
          </label>
          <input
            type="text"
            value={company.regNumber}
            onChange={(e) => handleChange('regNumber', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-hidden font-mono"
            placeholder="e.g. CORP-CA-2018-8831"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Street Address
          </label>
          <input
            type="text"
            value={company.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-hidden"
            placeholder="e.g. 122 Innovation Drive, Suite 400"
          />
        </div>

        {/* City State Zip */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            City, State & Zip / Postal Code
          </label>
          <input
            type="text"
            value={company.cityStateZip}
            onChange={(e) => handleChange('cityStateZip', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-hidden"
            placeholder="e.g. Tech City, CA 94016"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Country
          </label>
          <input
            type="text"
            value={company.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-hidden"
            placeholder="e.g. United States"
          />
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Payroll Contact Email
          </label>
          <input
            type="email"
            value={company.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-hidden"
            placeholder="e.g. payroll@nexuscorpsolutions.com"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Website URL
          </label>
          <input
            type="text"
            value={company.website}
            onChange={(e) => handleChange('website', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-hidden font-mono"
            placeholder="e.g. www.nexuscorpsolutions.com"
          />
        </div>
      </div>

      {/* Logos and Signatures Section */}
      <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Custom Logo Upload */}
        <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xs">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
            Company Logo (Image)
          </label>
          <div className="flex items-center gap-3">
            {company.logoUrl ? (
              <div className="relative group">
                <img
                  src={company.logoUrl}
                  alt="Company Logo"
                  className="w-12 h-12 object-contain bg-white border border-slate-300 rounded-xs p-1"
                />
                <button
                  type="button"
                  onClick={() => onChange({ ...company, logoUrl: undefined })}
                  className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 shadow-sm hover:bg-red-700"
                  title="Remove logo"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-12 h-12 bg-slate-900 flex items-center justify-center rounded-xs shrink-0">
                <div className="w-6 h-6 border-2 border-white rotate-45"></div>
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                ref={logoInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'logoUrl')}
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-900 text-xs font-bold text-slate-800 rounded-xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                {company.logoUrl ? 'Change Logo' : 'Upload Logo'}
              </button>
              <p className="text-[10px] text-slate-500 mt-1">PNG, JPG or SVG (Transparent recommended)</p>
            </div>
          </div>
        </div>

        {/* Signatory & Title */}
        <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xs space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Authorized Signatory Details
          </label>
          <input
            type="text"
            value={company.signatoryName}
            onChange={(e) => handleChange('signatoryName', e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 bg-white"
            placeholder="Signatory Name (e.g. Marcus Vance)"
          />
          <input
            type="text"
            value={company.signatoryTitle}
            onChange={(e) => handleChange('signatoryTitle', e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 bg-white"
            placeholder="Title (e.g. Chief Financial Officer)"
          />
          <div className="flex items-center gap-2 pt-1">
            <input
              type="file"
              ref={sigInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'signatureUrl')}
            />
            <button
              type="button"
              onClick={() => sigInputRef.current?.click()}
              className="flex-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 hover:border-slate-800 py-1 px-2 rounded-xs flex items-center justify-center gap-1"
            >
              <Upload className="w-3 h-3" />
              {company.signatureUrl ? 'Update Signature' : 'Upload Signature'}
            </button>
            {company.signatureUrl && (
              <button
                type="button"
                onClick={() => onChange({ ...company, signatureUrl: undefined })}
                className="text-red-600 hover:text-red-700 text-xs p-1"
                title="Remove signature"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security Stamp / Badge Text */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
          Verification Stamp / Watermark Text
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={company.stampText || ''}
            onChange={(e) => handleChange('stampText', e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-900 outline-hidden uppercase font-mono"
            placeholder="e.g. VERIFIED & APPROVED FOR DISBURSEMENT"
          />
          {company.stampText && (
            <span className="text-emerald-600 text-xs flex items-center gap-1 font-bold whitespace-nowrap">
              <CheckCircle2 className="w-4 h-4" /> Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
