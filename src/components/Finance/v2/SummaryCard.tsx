import React from 'react';
import { motion } from 'framer-motion';
import { LucideProps, ArrowUp, ArrowDown } from 'lucide-react';

interface SummaryCardProps {
  label: string;
  value: number;
  change: number;
  icon: React.ComponentType<LucideProps>;
  color: string;
  invertChange?: boolean;
}

const formatCurrency = (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, change, icon: Icon, color, invertChange = false }) => {
  const isPositive = !invertChange ? change >= 0 : change < 0;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-soft dark:shadow-dark-soft border border-transparent dark:border-dark-600 hover:shadow-hover dark:hover:shadow-dark-hover transition-all"
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-xl bg-sand-100 dark:bg-dark-700">
          <Icon size={24} className={color} />
        </div>
        <div>
          <p className="text-charcoal-500 dark:text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-charcoal-900 dark:text-white mt-1">
            {formatCurrency(value)}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-1 text-sm">
        <div className={`flex items-center ${changeColor}`}>
          {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          <span>{Math.abs(change).toFixed(2)}%</span>
        </div>
        <span className="text-charcoal-500 dark:text-gray-400">vs last 30 days</span>
      </div>
    </motion.div>
  );
};
