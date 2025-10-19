import React from 'react';
import { motion } from 'framer-motion';
import { LucideProps } from 'lucide-react';

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<LucideProps>;
  color: string;
  format?: 'currency' | 'bdt' | 'number';
}

const formatValue = (value: number, format: SummaryCardProps['format']) => {
  if (format === 'currency') {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
  if (format === 'bdt') {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'BDT' });
  }
  return value.toLocaleString();
};

export const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, icon: Icon, color, format = 'number' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-soft dark:shadow-dark-soft border border-transparent dark:border-dark-600 hover:shadow-hover dark:hover:shadow-dark-hover transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-charcoal-500 dark:text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-charcoal-900 dark:text-white mt-1">
            {formatValue(value, format)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-sand-100 dark:bg-dark-700">
          <Icon size={28} className={color} />
        </div>
      </div>
    </motion.div>
  );
};
