import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PayslipData } from '../types/payroll';

/**
 * Triggers native browser print dialog with print-optimized styles
 */
export function printPayslip(): void {
  window.print();
}

/**
 * Generates and downloads a high-fidelity PDF from an HTML element
 */
export async function downloadPdfPayslip(
  elementId: string,
  filename = 'Payslip.pdf'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return false;
  }

  try {
    // Generate high resolution canvas
    const canvas = await html2canvas(element, {
      scale: 2.5, // High DPI for crystal clear text
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create A4 PDF in portrait
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgProps = pdf.getImageProperties(imgData);
    const imgRatio = imgProps.width / imgProps.height;
    
    // Fit to A4 with 5mm margin
    const margin = 5;
    const availableWidth = pdfWidth - (margin * 2);
    const availableHeight = pdfHeight - (margin * 2);
    
    let renderWidth = availableWidth;
    let renderHeight = renderWidth / imgRatio;
    
    if (renderHeight > availableHeight) {
      renderHeight = availableHeight;
      renderWidth = renderHeight * imgRatio;
    }
    
    const posX = margin + (availableWidth - renderWidth) / 2;
    const posY = margin;

    pdf.addImage(imgData, 'PNG', posX, posY, renderWidth, renderHeight, undefined, 'FAST');
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF Generation failed:', error);
    // Fallback to print
    window.print();
    return false;
  }
}

/**
 * Exports payroll summary data as CSV for accounting & spreadsheets
 */
export function exportPayrollCSV(payslips: PayslipData[]): void {
  if (!payslips || payslips.length === 0) return;

  const headers = [
    'Slip No',
    'Employee Code',
    'Employee Name',
    'Designation',
    'Department',
    'Pay Period',
    'Payment Date',
    'Bank Name',
    'Account No',
    'Tax ID',
    'Days Worked',
    'Gross Earnings',
    'Total Deductions',
    'Net Salary',
    'Currency',
  ];

  const rows = payslips.map((data) => {
    const gross = data.earnings.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
    const deductions = data.deductions.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
    const net = gross - deductions;

    return [
      `"${data.payPeriod.slipNumber}"`,
      `"${data.employee.employeeCode}"`,
      `"${data.employee.fullName.replace(/"/g, '""')}"`,
      `"${data.employee.designation}"`,
      `"${data.employee.department}"`,
      `"${data.payPeriod.periodMonth}"`,
      `"${data.payPeriod.paymentDate}"`,
      `"${data.employee.bankName}"`,
      `"${data.employee.bankAccount}"`,
      `"${data.employee.taxIdNumber}"`,
      data.employee.daysWorked,
      gross.toFixed(2),
      deductions.toFixed(2),
      net.toFixed(2),
      data.currency.code,
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Payroll_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
