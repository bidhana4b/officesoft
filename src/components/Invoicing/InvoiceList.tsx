import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Eye } from 'lucide-react';
import { Invoice } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface InvoiceListProps {
  invoices: Invoice[];
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onCreateNew: () => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onView, onEdit, onCreateNew }) => {
  const { isDarkMode } = useTheme();

  const getStatusChip = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'draft':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const calculateTotal = (invoice: Invoice) => {
    return invoice.lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-header font-semibold text-charcoal-900 dark:text-white mb-2">Invoices</h1>
          <p className="text-charcoal-600 dark:text-gray-400">Manage all your client invoices in one place.</p>
        </div>
        <motion.button
          onClick={onCreateNew}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-3 rounded-xl font-medium hover:shadow-hover dark:hover:shadow-dark-hover transition-all shadow-soft dark:shadow-dark-soft flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Invoice</span>
        </motion.button>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-sand-200 dark:border-dark-600">
                <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400">Invoice #</th>
                <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400">Client</th>
                <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400">Amount</th>
                <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400">Due Date</th>
                <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400">Status</th>
                <th className="p-3 text-sm font-medium text-charcoal-500 dark:text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <motion.tr
                  key={invoice.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-sand-100 dark:border-dark-700 last:border-b-0 hover:bg-sand-50 dark:hover:bg-dark-700/50"
                >
                  <td className="p-3 font-semibold text-accent-teal dark:text-accent-teal-dark">{invoice.id}</td>
                  <td className="p-3 text-charcoal-800 dark:text-gray-200">{invoice.client.name}</td>
                  <td className="p-3 font-medium text-charcoal-800 dark:text-gray-200">${calculateTotal(invoice).toLocaleString()}</td>
                  <td className="p-3 text-charcoal-600 dark:text-gray-400">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusChip(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => onView(invoice)} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-600 rounded-lg text-charcoal-500 dark:text-gray-400">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => onEdit(invoice)} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-600 rounded-lg text-charcoal-500 dark:text-gray-400">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
