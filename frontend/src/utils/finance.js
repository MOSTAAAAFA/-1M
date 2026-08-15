/**
 * Shared financing math for the 1M Motors finance calculator
 * and configurator monthly estimate.
 */

export function parseHp(value) {
  if (!value) return 0;
  const digits = String(value).replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

/**
 * Standard amortization formula.
 * @returns {{ loan, downPayment, monthly, totalInterest }}
 */
export function calcFinance(price, downPct, aprPct, months) {
  const down = (price * downPct) / 100;
  const loan = Math.max(0, price - down);
  const r = aprPct / 100 / 12;

  let monthly = 0;
  if (loan > 0) {
    if (r === 0) {
      monthly = loan / months;
    } else {
      monthly = (loan * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    }
  }

  const totalInterest = Math.max(0, monthly * months - loan);

  return {
    loan,
    downPayment: down,
    monthly,
    totalInterest,
    totalPaid: monthly * months,
  };
}

export const fmtCurrency = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

/**
 * Compact luxury price formatting — designed to NEVER truncate in tight card layouts.
 * $189,000 -> "$189,000" · $2,350,000 -> "$2.35M"
 */
export function compactPrice(n) {
  const value = Number(n) || 0;
  if (value >= 1000000) {
    const m = value / 1000000;
    const s = m >= 10 ? m.toFixed(0) : m.toFixed(1).replace(/\.0$/, '');
    return `$${s}M`;
  }
  return `$${Math.round(value).toLocaleString('en-US')}`;
}
