export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export interface EarningItem {
  id: string;
  name: string;
  amount: number;
  isTaxable?: boolean;
  type?: 'fixed' | 'percentage';
  percentageOfBasic?: number;
  isBonus?: boolean;
}

export interface DeductionItem {
  id: string;
  name: string;
  amount: number;
  type?: 'fixed' | 'percentage';
  percentageOfGross?: number;
  isStatutory?: boolean;
}

export interface EmployerContribution {
  id: string;
  name: string;
  amount: number;
}

export interface CompanyDetails {
  name: string;
  tagline?: string;
  address: string;
  cityStateZip: string;
  country: string;
  taxId: string; // EIN, PAN, VAT, GST
  regNumber: string;
  email: string;
  phone: string;
  website: string;
  logoUrl?: string;
  signatoryName: string;
  signatoryTitle: string;
  signatureUrl?: string;
  stampText?: string;
}

export interface EmployeeDetails {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  joiningDate: string;
  location: string;
  // Banking & Tax
  bankName: string;
  bankAccount: string;
  routingOrIfsc: string;
  taxIdNumber: string; // PAN / SSN / National ID
  providentFundNo?: string;
  // Attendance & Time
  daysInMonth: number;
  daysWorked: number;
  paidLeaves: number;
  unpaidLeaves: number;
  overtimeHours: number;
  overtimeRatePerHour: number;
}

export interface PayPeriodDetails {
  periodMonth: string; // e.g. "October 2024" or "2024-10"
  periodLabel: string; // e.g. "Statement for October 2024"
  startDate: string;
  endDate: string;
  paymentDate: string;
  paymentMethod: 'Bank Transfer' | 'Direct Deposit' | 'Cheque' | 'Cash' | 'Wire Transfer';
  referenceNo: string;
  slipNumber: string;
}

export interface YtdSummary {
  enabled: boolean;
  ytdGross: number;
  ytdTax: number;
  ytdDeductions: number;
  ytdNet: number;
}

export interface PayslipData {
  id: string;
  currency: Currency;
  company: CompanyDetails;
  employee: EmployeeDetails;
  payPeriod: PayPeriodDetails;
  earnings: EarningItem[];
  deductions: DeductionItem[];
  employerContributions: EmployerContribution[];
  showEmployerContributions: boolean;
  ytd: YtdSummary;
  notes: string;
  confidentialityNotice: string;
  templateStyle: 'geometric' | 'executive' | 'modern' | 'compact';
}

export interface PayrollBatchItem {
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  grossEarnings: number;
  totalDeductions: number;
  netPay: number;
  status: 'Draft' | 'Generated' | 'Paid';
}
