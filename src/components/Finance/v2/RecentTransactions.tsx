import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction } from '../../../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const formatCurrency = (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-charcoal-900 dark:text-white">Recent Transactions</h2>
        <button className="text-sm font-medium text-accent-teal hover:text-accent-teal-dark">
            View All
        </button>
      </div>
      
      <div className="space-y-3 flex-1">
        {transactions.map((t, index) => (
          <motion.div 
            key={t.id} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-sand-50 dark:hover:bg-dark-700/50"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                {t.type === 'income' ? <ArrowUpRight className="text-green-600 dark:text-green-400" size={16}/> : <ArrowDownLeft className="text-red-600 dark:text-red-400" size={16}/>}
              </div>
              <div>
                  <p className="text-sm text-charcoal-800 dark:text-gray-200 font-medium">{t.description}</p>
                  <p className="text-xs text-charcoal-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className={`text-sm font-semibold text-right ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
