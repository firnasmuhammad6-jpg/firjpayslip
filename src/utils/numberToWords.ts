/**
 * Converts a number to words for financial/payslip statements
 */

const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertThreeDigits(num: number): string {
  let result = '';
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;

  if (hundred > 0) {
    result += ones[hundred] + ' Hundred';
    if (remainder > 0) {
      result += ' and ';
    }
  }

  if (remainder > 0) {
    if (remainder < 20) {
      result += ones[remainder];
    } else {
      const ten = Math.floor(remainder / 10);
      const one = remainder % 10;
      result += tens[ten];
      if (one > 0) {
        result += ' ' + ones[one];
      }
    }
  }

  return result;
}

export function numberToWords(amount: number, currencyCode = 'USD'): string {
  if (isNaN(amount) || amount === 0) {
    return 'Zero Dollars Only';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const integerPart = Math.floor(absAmount);
  const decimalPart = Math.round((absAmount - integerPart) * 100);

  // Currency names
  let majorUnit = 'Dollars';
  let minorUnit = 'Cents';

  switch (currencyCode.toUpperCase()) {
    case 'INR':
      majorUnit = 'Rupees';
      minorUnit = 'Paise';
      break;
    case 'EUR':
      majorUnit = 'Euros';
      minorUnit = 'Cents';
      break;
    case 'GBP':
      majorUnit = 'Pounds';
      minorUnit = 'Pence';
      break;
    case 'AED':
      majorUnit = 'Dirhams';
      minorUnit = 'Fils';
      break;
    case 'SAR':
      majorUnit = 'Riyals';
      minorUnit = 'Halalas';
      break;
    case 'CAD':
    case 'AUD':
    case 'SGD':
    case 'NZD':
    case 'USD':
      majorUnit = 'Dollars';
      minorUnit = 'Cents';
      break;
    case 'JPY':
      majorUnit = 'Yen';
      minorUnit = 'Sen';
      break;
    default:
      majorUnit = currencyCode;
      minorUnit = 'Cents';
  }

  // Handle Indian numbering format if INR
  if (currencyCode.toUpperCase() === 'INR') {
    return convertIndianFormat(integerPart, decimalPart, majorUnit, minorUnit, isNegative);
  }

  const billions = Math.floor(integerPart / 1000000000);
  const millions = Math.floor((integerPart % 1000000000) / 1000000);
  const thousands = Math.floor((integerPart % 1000000) / 1000);
  const hundreds = integerPart % 1000;

  const parts: string[] = [];

  if (billions > 0) {
    parts.push(convertThreeDigits(billions) + ' Billion');
  }
  if (millions > 0) {
    parts.push(convertThreeDigits(millions) + ' Million');
  }
  if (thousands > 0) {
    parts.push(convertThreeDigits(thousands) + ' Thousand');
  }
  if (hundreds > 0 || parts.length === 0) {
    parts.push(convertThreeDigits(hundreds));
  }

  let words = parts.join(' ').trim();
  if (words === '') words = 'Zero';

  let result = (isNegative ? 'Negative ' : '') + words + ' ' + majorUnit;

  if (decimalPart > 0) {
    result += ' and ' + convertThreeDigits(decimalPart) + ' ' + minorUnit;
  }

  return result + ' Only';
}

function convertIndianFormat(
  integerPart: number,
  decimalPart: number,
  majorUnit: string,
  minorUnit: string,
  isNegative: boolean
): string {
  if (integerPart === 0) {
    return `${isNegative ? 'Negative ' : ''}Zero ${majorUnit} Only`;
  }

  const crores = Math.floor(integerPart / 10000000);
  const lakhs = Math.floor((integerPart % 10000000) / 100000);
  const thousands = Math.floor((integerPart % 100000) / 1000);
  const hundreds = integerPart % 1000;

  const parts: string[] = [];

  if (crores > 0) parts.push(convertThreeDigits(crores) + ' Crore');
  if (lakhs > 0) parts.push(convertThreeDigits(lakhs) + ' Lakh');
  if (thousands > 0) parts.push(convertThreeDigits(thousands) + ' Thousand');
  if (hundreds > 0 || parts.length === 0) parts.push(convertThreeDigits(hundreds));

  let words = parts.join(' ').trim();
  let result = (isNegative ? 'Negative ' : '') + words + ' ' + majorUnit;

  if (decimalPart > 0) {
    result += ' and ' + convertThreeDigits(decimalPart) + ' ' + minorUnit;
  }

  return result + ' Only';
}
