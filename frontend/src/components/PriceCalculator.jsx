import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

export default function PriceCalculator({
  basePrice = 100000,
  options = [],
  taxRate = 0.08,
  dealerFee = 1200,
  onTotalChange,
  className,
  style = {},
}) {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [downPayment, setDownPayment] = useState(20);
  const [loanTerm, setLoanTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(3.5);

  const optionsTotal = Object.entries(selectedOptions).reduce((sum, [key, value]) => {
    const option = options.find(o => o.id === key);
    return sum + (value ? option?.price || 0 : 0);
  }, 0);

  const subtotal = basePrice + optionsTotal;
  const tax = subtotal * taxRate;
  const total = subtotal + tax + dealerFee;

  const downPaymentAmount = total * (downPayment / 100);
  const loanAmount = total - downPaymentAmount;
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);

  useEffect(() => {
    onTotalChange?.(total);
  }, [total, onTotalChange]);

  return (
    <div className={className} style={{ ...styles.container, ...style }}>
      {/* Price Breakdown */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Price Breakdown</h3>

        <div style={styles.priceRow}>
          <span style={styles.priceLabel}>Base Price</span>
          <span style={styles.priceValue}>
            <AnimatedCounter to={basePrice} prefix="$" separator="," />
          </span>
        </div>

        {/* Options */}
        {options.length > 0 && (
          <div style={styles.optionsContainer}>
            {options.map((option) => (
              <label key={option.id} style={styles.option}>
                <input
                  type="checkbox"
                  checked={selectedOptions[option.id] || false}
                  onChange={(e) => setSelectedOptions({
                    ...selectedOptions,
                    [option.id]: e.target.checked,
                  })}
                  style={styles.checkbox}
                />
                <div>
                  <div style={styles.optionName}>{option.name}</div>
                  <div style={styles.optionPrice}>+${option.price.toLocaleString()}</div>
                </div>
              </label>
            ))}
          </div>
        )}

        {optionsTotal > 0 && (
          <div style={styles.priceRow}>
            <span style={styles.priceLabel}>Options Total</span>
            <span style={styles.priceValue}>
              +<AnimatedCounter to={optionsTotal} prefix="$" separator="," />
            </span>
          </div>
        )}

        <div style={styles.priceRow}>
          <span style={styles.priceLabel}>Tax ({taxRate * 100}%)</span>
          <span style={styles.priceValue}>
            <AnimatedCounter to={tax} prefix="$" separator="," decimals={0} />
          </span>
        </div>

        <div style={styles.priceRow}>
          <span style={styles.priceLabel}>Dealer Fee</span>
          <span style={styles.priceValue}>
            <AnimatedCounter to={dealerFee} prefix="$" separator="," />
          </span>
        </div>

        <div style={styles.divider} />

        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total Price</span>
          <span style={styles.totalValue}>
            <AnimatedCounter to={total} prefix="$" separator="," decimals={0} duration={1000} />
          </span>
        </div>
      </div>

      {/* Financing Calculator */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Financing Options</h3>

        <div style={styles.sliderGroup}>
          <div style={styles.sliderLabel}>
            <span>Down Payment</span>
            <span style={styles.sliderValue}>{downPayment}% (${(downPaymentAmount).toLocaleString()})</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            style={styles.slider}
          />
        </div>

        <div style={styles.sliderGroup}>
          <div style={styles.sliderLabel}>
            <span>Loan Term</span>
            <span style={styles.sliderValue}>{loanTerm} months</span>
          </div>
          <input
            type="range"
            min="12"
            max="84"
            step="12"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            style={styles.slider}
          />
        </div>

        <div style={styles.sliderGroup}>
          <div style={styles.sliderLabel}>
            <span>Interest Rate</span>
            <span style={styles.sliderValue}>{interestRate.toFixed(2)}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            style={styles.slider}
          />
        </div>

        <motion.div
          style={styles.monthlyPayment}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          key={monthlyPayment}
        >
          <div style={styles.monthlyLabel}>Estimated Monthly Payment</div>
          <div style={styles.monthlyValue}>
            <AnimatedCounter to={monthlyPayment} prefix="$" separator="," decimals={0} duration={500} />
            <span style={styles.monthlyPeriod}>/mo</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'rgba(17, 17, 23, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(201, 168, 76, 0.2)',
    borderRadius: '16px',
    padding: '32px',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#C9A84C',
    marginBottom: '20px',
    letterSpacing: '0.5px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    fontSize: '15px',
  },
  priceLabel: {
    color: 'rgba(240, 237, 232, 0.7)',
  },
  priceValue: {
    color: '#F0EDE8',
    fontWeight: '600',
  },
  optionsContainer: {
    margin: '16px 0',
    padding: '16px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background 0.2s',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  optionName: {
    color: '#F0EDE8',
    fontSize: '14px',
    fontWeight: '600',
  },
  optionPrice: {
    color: '#C9A84C',
    fontSize: '13px',
  },
  divider: {
    height: '1px',
    background: 'rgba(201, 168, 76, 0.2)',
    margin: '16px 0',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
  },
  totalLabel: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#F0EDE8',
  },
  totalValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#C9A84C',
    letterSpacing: '0.5px',
  },
  sliderGroup: {
    marginBottom: '24px',
  },
  sliderLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '14px',
    color: 'rgba(240, 237, 232, 0.7)',
  },
  sliderValue: {
    color: '#C9A84C',
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    background: 'rgba(201, 168, 76, 0.2)',
    outline: 'none',
    WebkitAppearance: 'none',
  },
  monthlyPayment: {
    marginTop: '24px',
    padding: '24px',
    background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.15) 0%, rgba(224, 192, 106, 0.1) 100%)',
    borderRadius: '12px',
    textAlign: 'center',
    border: '2px solid rgba(201, 168, 76, 0.3)',
  },
  monthlyLabel: {
    fontSize: '13px',
    color: 'rgba(240, 237, 232, 0.6)',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  monthlyValue: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#C9A84C',
    letterSpacing: '0.5px',
  },
  monthlyPeriod: {
    fontSize: '18px',
    color: 'rgba(201, 168, 76, 0.7)',
    marginLeft: '4px',
  },
};
