import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Check, Play, AlertCircle, CheckCircle } from 'lucide-react';
import { Campaign, Client, TeamMember } from '../../types';
import { mockAdPlatforms } from '../../data/mockData';

interface AdCampaignsViewProps {
  campaigns: Campaign[];
  clients: Client[];
  teamMembers: TeamMember[];
  onNewRequest: () => void;
  onComplete: (campaign: Campaign) => void;
}

const formatCurrency = (value: number, currency = 'USD') => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);

export const AdCampaignsView: React.FC<AdCampaignsViewProps> = ({ campaigns, clients, teamMembers, onNewRequest, onComplete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusChip = (status: Campaign['status']) => {
    switch (status) {
      case 'running': return { icon: Play, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' };
      case 'completed': return { icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };
      case 'pending': return { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' };
      case 'cancelled': return { icon: AlertCircle, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
      default: return { icon: AlertCircle, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' };
    }
  };

  const filteredCampaigns = campaigns
    .filter(c => statusFilter === 'all' || c.status === statusFilter)
    .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">Campaigns</h2>
          <p className="text-charcoal-600 dark:text-gray-400 text-sm">Manage all ad requests and campaign performance.</p>
        </div>
        <motion.button onClick={onNewRequest} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2">
          <Plus size={18} />
          <span>New Ad Request</span>
        </motion.button>
      </div>

      <div className="flex items-center justify-between space-x-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400 dark:text-gray-500" />
          <input type="text" placeholder="Search campaigns..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-teal" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-teal">
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto -mx-6">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-white dark:bg-dark-800">
            <tr className="border-b border-sand-200 dark:border-dark-600">
              <th className="p-3 pl-6 text-sm font-medium text-charcoal-500 dark:text-gray-400">Campaign</th>
              <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400">Client</th>
              <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400">Status</th>
              <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400 text-right">Budget</th>
              <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400 text-right">Spend</th>
              <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400 text-right">Profit (BDT)</th>
              <th className="p-3 pr-6 text-sm font-medium text-charcoal-500 dark:text-gray-400 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map(c => {
                const client = clients.find(cl => cl.id === c.clientId);
                const platform = mockAdPlatforms.find(p => p.id === c.platformId);
                const statusInfo = getStatusChip(c.status);
                const StatusIcon = statusInfo.icon;
                return (
                    <tr key={c.id} className="border-b border-sand-100 dark:border-dark-700 last:border-b-0">
                        <td className="p-3 pl-6">
                            <div className="flex items-center space-x-3">
                                {platform && <platform.icon size={20} className="text-charcoal-500" />}
                                <div>
                                    <p className="font-medium text-charcoal-800 dark:text-gray-200">{c.name}</p>
                                    <p className="text-xs text-charcoal-500 dark:text-gray-500">Created: {new Date(c.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </td>
                        <td className="p-3 text-sm text-charcoal-600 dark:text-gray-400">{client?.name || 'N/A'}</td>
                        <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 ${statusInfo.color}`}>
                                <StatusIcon size={14} />
                                <span>{c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span>
                            </span>
                        </td>
                        <td className="p-3 text-sm text-charcoal-600 dark:text-gray-400 text-right">{formatCurrency(c.budgetUSD)}</td>
                        <td className="p-3 text-sm text-charcoal-800 dark:text-gray-200 font-medium text-right">{c.actualSpendUSD ? formatCurrency(c.actualSpendUSD) : '---'}</td>
                        <td className={`p-3 text-sm font-semibold text-right ${c.profit && c.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {c.profit ? formatCurrency(c.profit, 'BDT') : '---'}
                        </td>
                        <td className="p-3 pr-6 text-center">
                            {c.status === 'running' && (
                                <button onClick={() => onComplete(c)} className="text-xs font-medium text-accent-teal hover:underline">Mark as Complete</button>
                            )}
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
