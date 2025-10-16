import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Trash2, ArrowUpRight, ArrowDownLeft, Edit } from 'lucide-react';
import { Transaction, Fund } from '../../../types';

interface TransactionsViewProps {
  transactions: Transaction[];
  funds: Fund[];
  onAddTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransactions: (transactionIds: string[]) => void;
}

const formatCurrency = (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const TransactionsView: React.FC<TransactionsViewProps> = ({ transactions, funds, onAddTransaction, onEditTransaction, onDeleteTransactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => typeFilter === 'all' || t.type === typeFilter)
      .filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, typeFilter, searchTerm]);

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredTransactions.map(t => t.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleDeleteSelected = () => {
    onDeleteTransactions(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const isAllSelected = selectedIds.size > 0 && selectedIds.size === filteredTransactions.length;

  return (
    <div className="space-y-6 bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">All Transactions</h2>
          <p className="text-charcoal-600 dark:text-gray-400 text-sm">A complete log of your financial activities.</p>
        </div>
        <motion.button
          onClick={onAddTransaction}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Transaction</span>
        </motion.button>
      </div>

      <div className="flex items-center justify-between space-x-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by description or category..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-teal"
          />
        </div>
        <div className="flex items-center space-x-2 p-1 bg-sand-100 dark:bg-dark-700 rounded-lg">
          {(['all', 'income', 'expense'] as const).map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1 rounded-md text-sm font-medium capitalize transition-colors ${typeFilter === type ? 'bg-white dark:bg-dark-800 shadow-sm text-accent-teal' : 'text-charcoal-600 dark:text-gray-400'}`}
            >
              {type}
            </button>
          ))}
        </div>
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <button onClick={handleDeleteSelected} className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                <Trash2 size={16} />
                <span>Delete ({selectedIds.size})</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-y-auto -mx-6">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-white dark:bg-dark-800">
            <tr className="border-b border-sand-200 dark:border-dark-600">
              <th className="p-3 pl-6 w-10"><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} className="rounded border-sand-300 text-accent-teal focus:ring-accent-teal" /></th>
              <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400">Description</th>
              <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400">Date</th>
              <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400">Fund</th>
              <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400 text-right">Amount</th>
              <th className="p-3 pr-6 text-sm font-medium text-charcoal-500 dark:text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredTransactions.map((t, index) => (
                <motion.tr
                  key={t.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.02 }}
                  className={`border-b border-sand-100 dark:border-dark-700 last:border-b-0 hover:bg-sand-50 dark:hover:bg-dark-700/50 ${selectedIds.has(t.id) ? 'bg-accent-teal/5 dark:bg-accent-teal/10' : ''}`}
                >
                  <td className="p-3 pl-6"><input type="checkbox" checked={selectedIds.has(t.id)} onChange={() => handleSelect(t.id)} className="rounded border-sand-300 text-accent-teal focus:ring-accent-teal" /></td>
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        {t.type === 'income' ? <ArrowUpRight className="text-green-600 dark:text-green-400" size={16} /> : <ArrowDownLeft className="text-red-600 dark:text-red-400" size={16} />}
                      </div>
                      <div>
                        <p className="text-sm text-charcoal-800 dark:text-gray-200 font-medium">{t.description}</p>
                        <p className="text-xs text-charcoal-500 dark:text-gray-400">{t.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-charcoal-600 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="p-3 text-sm text-charcoal-600 dark:text-gray-400">{funds.find(f => f.id === t.fundId)?.name || 'N/A'}</td>
                  <td className={`p-3 text-sm font-semibold text-right ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                  </td>
                  <td className="p-3 pr-6 text-right">
                    <button onClick={() => onEditTransaction(t)} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-600 rounded-lg text-charcoal-500 dark:text-gray-400">
                        <Edit size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
