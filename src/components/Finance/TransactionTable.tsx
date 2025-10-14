import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { IncomeTransaction, ExpenseTransaction } from '../../types';

interface TransactionTableProps {
  title: string;
  transactions: (IncomeTransaction | ExpenseTransaction)[];
  type: 'income' | 'expense';
  onAdd: () => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ title, transactions, type, onAdd }) => {
  const isIncome = type === 'income';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">{title}</h2>
        <motion.button
          onClick={onAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-sand-100 dark:bg-dark-700 text-charcoal-700 dark:text-gray-300 px-4 py-2 rounded-xl font-medium hover:bg-sand-200 dark:hover:bg-dark-600 transition-colors flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add {title}</span>
        </motion.button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-sand-200 dark:border-dark-600">
              <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400">Description</th>
              {isIncome && <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400">Sector</th>}
              {isIncome && <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400">Fund</th>}
              {!isIncome && <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400">Category</th>}
              <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <motion.tr 
                key={t.id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-sand-100 dark:border-dark-700 last:border-b-0 hover:bg-sand-50 dark:hover:bg-dark-700/50"
              >
                <td className="p-3 text-sm text-charcoal-800 dark:text-gray-200 font-medium">{t.description}</td>
                {isIncome && <td className="p-3 text-sm text-charcoal-600 dark:text-gray-400">{(t as IncomeTransaction).sector}</td>}
                {isIncome && <td className="p-3 text-sm text-charcoal-600 dark:text-gray-400">{(t as IncomeTransaction).fund}</td>}
                {!isIncome && <td className="p-3 text-sm text-charcoal-600 dark:text-gray-400">{(t as ExpenseTransaction).category}</td>}
                <td className={`p-3 text-sm font-semibold text-right ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {t.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
