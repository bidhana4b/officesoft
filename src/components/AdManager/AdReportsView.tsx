import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Campaign, Client, AdAccount } from '../../types';

interface AdReportsViewProps {
  campaigns: Campaign[];
  clients: Client[];
  adAccounts: AdAccount[];
}

const formatCurrency = (value: number, currency = 'BDT') => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);

export const AdReportsView: React.FC<AdReportsViewProps> = ({ campaigns, clients, adAccounts }) => {
  const completedCampaigns = useMemo(() => 
    campaigns.filter(c => c.status === 'completed' && c.profit !== undefined), 
    [campaigns]
  );

  const totalProfit = useMemo(() => 
    completedCampaigns.reduce((sum, c) => sum + c.profit!, 0),
    [completedCampaigns]
  );

  return (
    <div className="space-y-6 bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">Profit & Loss Report</h2>
          <p className="text-charcoal-600 dark:text-gray-400 text-sm">Detailed profit breakdown for completed campaigns.</p>
        </div>
        <div className="p-4 bg-sand-50 dark:bg-dark-700 rounded-xl text-right">
            <p className="text-sm text-charcoal-500 dark:text-gray-400">Total Net Profit</p>
            <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalProfit)}
            </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto -mx-6">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-white dark:bg-dark-800">
            <tr className="border-b border-sand-200 dark:border-dark-600">
              <th className="p-3 pl-6 text-sm font-medium text-charcoal-500 dark:text-gray-400">Campaign</th>
              <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400 text-right">Spend (USD)</th>
              <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400 text-right">Revenue (BDT)</th>
              <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400 text-right">Cost (BDT)</th>
              <th className="p-3 pr-6 text-sm font-medium text-charcoal-500 dark:text-gray-400 text-right">Profit (BDT)</th>
            </tr>
          </thead>
          <tbody>
            {completedCampaigns.map(c => {
                const revenue = (c.actualSpendUSD || 0) * (clients.find(cl => cl.id === c.clientId)?.avgDepositRate || 0);
                const cost = (c.actualSpendUSD || 0) * (adAccounts.find(acc => acc.id === c.adAccountId)?.avgCostPerUSD || 0);
                return (
                    <tr key={c.id} className="border-b border-sand-100 dark:border-dark-700 last:border-b-0">
                        <td className="p-3 pl-6">
                            <p className="font-medium text-charcoal-800 dark:text-gray-200">{c.name}</p>
                            <p className="text-xs text-charcoal-500 dark:text-gray-400">Completed: {new Date(c.completedAt!).toLocaleDateString()}</p>
                        </td>
                        <td className="p-3 text-sm text-charcoal-600 dark:text-gray-400 text-right">{formatCurrency(c.actualSpendUSD || 0, 'USD')}</td>
                        <td className="p-3 text-sm text-charcoal-600 dark:text-gray-400 text-right">{formatCurrency(revenue)}</td>
                        <td className="p-3 text-sm text-charcoal-600 dark:text-gray-400 text-right">{formatCurrency(cost)}</td>
                        <td className={`p-3 pr-6 text-sm font-semibold text-right ${c.profit! >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(c.profit!)}
                        </td>
                    </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
