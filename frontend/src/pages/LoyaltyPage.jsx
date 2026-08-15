import React from 'react';
import { motion } from 'framer-motion';
import LoyaltyDashboard from '../components/LoyaltyDashboard';

const LoyaltyPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        paddingTop: '100px',
        background: 'linear-gradient(135deg, #050507 0%, #0a0a0e 100%)',
      }}
    >
      <LoyaltyDashboard />
    </motion.div>
  );
};

export default LoyaltyPage;
