import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { Client } from '../../types';

interface AdClientsViewProps {
  clients: Client[];
  onAddDeposit: (client: Client) => void;
}

const formatCurrency = (value: number, currency = 'USD') => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);

export const AdClientsView: React.FC<AdClientsViewProps> = ({ clients, onAddDeposit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">Client Ad Balances</h2>
          <p className="text-charcoal-600 dark:text-gray-400 text-sm">Manage client deposits and track their ad spend balance.</p>
        </div>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400 dark:text-gray-500" />
        <input type="text" placeholder="Search clients..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-teal" />
      </div>

      <div className="flex-1 overflow-y-auto -mx-6">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-white dark:bg-dark-800">
            <tr className="border-b border-sand-200 dark:border-dark-600">
              <th className="p-3 pl-6 text-sm font-medium text-charcoal-500 dark:text-gray-400">Client</th>
              <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400 text-right">Avg. Deposit Rate (BDT)</th>
              <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400 text-right">Current Balance (USD)</th>
              <th className="p-3 pr-6 text-sm font-medium text-charcoal-500 dark:text-gray-400 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(c => (
              <tr key={c.id} className="border-b border-sand-100 dark:border-dark-700 last:border-b-0">
                <td className="p-3 pl-6">
                  <div className="flex items-center space-x-3">
                    <img src={c.logo} alt={c.name} className="w-8 h-8 rounded-lg" />
                    <div>
                      <p className="font-medium text-charcoal-800 dark:text-gray-200">{c.name}</p>
                      <p className="text-xs text-charcoal-500 dark:text-gray-400">{c.contactPerson.name}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-sm text-charcoal-600 dark:text-gray-400 text-right">{c.avgDepositRate ? formatCurrency(c.avgDepositRate, 'BDT') : 'N/A'}</td>
                <td className={`p-3 text-sm font-semibold text-right ${c.adBalanceUSD && c.adBalanceUSD < 0 ? 'text-red-500' : 'text-charcoal-800 dark:text-gray-200'}`}>
                  {formatCurrency(c.adBalanceUSD || 0)}
                </td>
                <td className="p-3 pr-6 text-center">
                  <button onClick={() => onAddDeposit(c)} className="text-xs font-medium text-accent-teal hover:underline flex items-center space-x-1 mx-auto">
                    <Plus size={14}/>
                    <span>Add Deposit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
