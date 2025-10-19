import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign } from 'lucide-react';
import { AdAccount } from '../../types';
import { mockAdPlatforms } from '../../data/mockData';

interface AdAccountsViewProps {
  adAccounts: AdAccount[];
  onRecharge: (account: AdAccount) => void;
}

const formatCurrency = (value: number, currency = 'USD') => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);

export const AdAccountsView: React.FC<AdAccountsViewProps> = ({ adAccounts, onRecharge }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">Ad Accounts</h2>
          <p className="text-charcoal-600 dark:text-gray-400 text-sm">Manage balances and costs for your ad platform accounts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adAccounts.map((acc, index) => {
          const platform = mockAdPlatforms.find(p => p.id === acc.platformId);
          const PlatformIcon = platform?.icon;
          return (
            <motion.div
              key={acc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {PlatformIcon && <PlatformIcon size={24} className="text-charcoal-600 dark:text-gray-400" />}
                  <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white">{acc.name}</h3>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${acc.balanceUSD < 1000 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {acc.balanceUSD < 1000 ? 'Low Balance' : 'Healthy'}
                </span>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-sand-50 dark:bg-dark-700 rounded-xl">
                  <p className="text-xs text-charcoal-500 dark:text-gray-400">Current Balance</p>
                  <p className="text-2xl font-bold text-charcoal-900 dark:text-white">{formatCurrency(acc.balanceUSD)}</p>
                </div>
                <div className="p-4 bg-sand-50 dark:bg-dark-700 rounded-xl">
                  <p className="text-xs text-charcoal-500 dark:text-gray-400">Avg. Cost per USD</p>
                  <p className="text-2xl font-bold text-charcoal-900 dark:text-white">{formatCurrency(acc.avgCostPerUSD, 'BDT')}</p>
                </div>
              </div>
              <motion.button
                onClick={() => onRecharge(acc)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 bg-sand-100 dark:bg-dark-700 text-charcoal-700 dark:text-gray-300 px-4 py-3 rounded-lg font-medium hover:bg-sand-200 dark:hover:bg-dark-600 transition-colors flex items-center justify-center space-x-2"
              >
                <DollarSign size={16} />
                <span>Recharge Account</span>
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
