import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, ArrowRightLeft } from 'lucide-react';
import { Fund } from '../../../types';

interface FundsViewProps {
  funds: Fund[];
  onTransfer: () => void;
}

const formatCurrency = (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const FundsView: React.FC<FundsViewProps> = ({ funds, onTransfer }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">Funds Management</h2>
          <p className="text-charcoal-600 dark:text-gray-400 text-sm">Track balances across your accounts.</p>
        </div>
        <div className="flex items-center space-x-4">
            <motion.button
            onClick={onTransfer}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-sand-100 dark:bg-dark-700 text-charcoal-700 dark:text-gray-300 px-4 py-2 rounded-xl font-medium flex items-center space-x-2"
            >
            <ArrowRightLeft size={16} />
            <span>Transfer Funds</span>
            </motion.button>
            <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2"
            >
            <Plus size={18} />
            <span>New Fund</span>
            </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {funds.map((fund, index) => (
          <motion.div
            key={fund.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-sand-100 dark:bg-dark-700">
                <Wallet size={24} className="text-accent-teal" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white">{fund.name}</h3>
                <p className="text-sm text-charcoal-500 dark:text-gray-400">Current Balance</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-charcoal-900 dark:text-white mb-4">{formatCurrency(fund.balance)}</p>
            <div className="h-2 w-full bg-sand-100 dark:bg-dark-700 rounded-full">
                <div className="h-full bg-gradient-to-r from-accent-teal to-accent-teal-dark rounded-full" style={{width: '100%'}}></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
