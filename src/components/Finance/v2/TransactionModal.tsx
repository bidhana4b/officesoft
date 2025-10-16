import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Transaction, Fund } from '../../../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  transaction: Transaction | null;
  funds: Fund[];
}

const modalVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } };
const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };

const incomeCategories = ['Web Development', 'Branding', 'Consulting', 'SEO', 'Other'];
const expenseCategories = ['Software', 'Salaries', 'Utilities', 'Marketing', 'Transfers', 'Other'];

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, transaction, funds }) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({});

  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        setFormData(transaction);
      } else {
        setFormData({
          type: 'income',
          description: '',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          category: incomeCategories[0],
          fundId: funds.length > 0 ? funds[0].id : '',
        });
      }
    }
  }, [transaction, isOpen, funds]);

  const handleTypeChange = (type: 'income' | 'expense') => {
    setFormData(prev => ({
      ...prev,
      type,
      category: type === 'income' ? incomeCategories[0] : expenseCategories[0],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || formData.amount <= 0 || !formData.fundId) return;

    const finalTransaction: Transaction = {
      id: transaction?.id || crypto.randomUUID(),
      type: formData.type!,
      description: formData.description,
      amount: Number(formData.amount),
      date: formData.date!,
      category: formData.category!,
      fundId: formData.fundId,
    };
      
    onSave(finalTransaction);
  };

  const isIncome = formData.type === 'income';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants} initial="hidden" animate="visible" exit="exit"
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-sand-200 dark:border-dark-600 flex items-center justify-between">
                <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">
                  {transaction ? 'Edit Transaction' : 'Add New Transaction'}
                </h2>
                <button type="button" onClick={onClose} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg">
                  <X size={20} className="text-charcoal-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="p-1 bg-sand-100 dark:bg-dark-700 rounded-lg flex">
                  <button type="button" onClick={() => handleTypeChange('income')} className={`w-1/2 p-2 rounded-md text-sm font-medium transition-colors ${isIncome ? 'bg-white dark:bg-dark-800 shadow-sm text-accent-teal' : 'text-charcoal-600 dark:text-gray-400'}`}>
                    Income
                  </button>
                  <button type="button" onClick={() => handleTypeChange('expense')} className={`w-1/2 p-2 rounded-md text-sm font-medium transition-colors ${!isIncome ? 'bg-white dark:bg-dark-800 shadow-sm text-accent-orange' : 'text-charcoal-600 dark:text-gray-400'}`}>
                    Expense
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Description</label>
                  <input type="text" name="description" value={formData.description || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Amount</label>
                    <input type="number" name="amount" value={formData.amount || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Date</label>
                    <input type="date" name="date" value={formData.date || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Category</label>
                    <select name="category" value={formData.category || ''} onChange={handleChange} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                      {(isIncome ? incomeCategories : expenseCategories).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Fund</label>
                    <select name="fundId" value={formData.fundId || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                      <option value="" disabled>Select a fund</option>
                      {funds.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-sand-50 dark:bg-dark-900 border-t border-sand-200 dark:border-dark-600 flex items-center justify-end space-x-4">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-medium bg-sand-200 dark:bg-dark-700 text-charcoal-800 dark:text-gray-300 hover:bg-sand-300 dark:hover:bg-dark-600 transition-colors">
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit"
                  className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-2 rounded-xl font-medium shadow-soft dark:shadow-dark-soft"
                >
                  Save Transaction
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
