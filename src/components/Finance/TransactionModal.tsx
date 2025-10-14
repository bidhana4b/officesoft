import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { IncomeTransaction, ExpenseTransaction } from '../../types';

type Transaction = Partial<IncomeTransaction> | Partial<ExpenseTransaction>;

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transactions: Transaction[], type: 'income' | 'expense') => void;
  type: 'income' | 'expense' | null;
}

const modalVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } };
const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };

const incomeSectors = ['Web Development', 'Branding', 'Consulting', 'Other'];
const incomeFunds = ['Main Account', 'Tax Fund', 'Savings'];
const expenseCategories = ['Software', 'Salaries', 'Utilities', 'Marketing', 'Other'];

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, type }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTransactions([{}]); // Start with one empty row
    } else {
      setTransactions([]);
    }
  }, [isOpen]);

  const handleAddRow = () => {
    setTransactions(prev => [...prev, {}]);
  };

  const handleRemoveRow = (index: number) => {
    setTransactions(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: number, field: string, value: string | number) => {
    setTransactions(prev => {
      const newTransactions = [...prev];
      newTransactions[index] = { ...newTransactions[index], [field]: value };
      return newTransactions;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) return;

    const newTransactions = transactions
      .filter(t => t.description && t.amount && t.amount > 0)
      .map(t => ({
        ...t,
        id: crypto.randomUUID(),
        date: new Date().toISOString().split('T')[0],
      }));
      
    onSave(newTransactions, type);
  };

  if (!type) return null;

  const isIncome = type === 'income';
  const title = isIncome ? 'Add Income' : 'Add Expenses';

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
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="p-6 border-b border-sand-200 dark:border-dark-600 flex items-center justify-between">
                <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">{title}</h2>
                <button type="button" onClick={onClose} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg">
                  <X size={20} className="text-charcoal-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                {transactions.map((transaction, index) => (
                  <motion.div 
                    key={index}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-12 gap-4 items-center bg-sand-50 dark:bg-dark-700/50 p-4 rounded-xl"
                  >
                    <input type="text" placeholder="Description" required value={transaction.description || ''} onChange={e => handleInputChange(index, 'description', e.target.value)} className="col-span-4 bg-white dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                    <input type="number" placeholder="Amount" required value={transaction.amount || ''} onChange={e => handleInputChange(index, 'amount', parseFloat(e.target.value))} className="col-span-2 bg-white dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                    
                    {isIncome ? (
                      <>
                        <select required value={(transaction as Partial<IncomeTransaction>).sector || ''} onChange={e => handleInputChange(index, 'sector', e.target.value)} className="col-span-2 bg-white dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                          <option value="" disabled>Sector</option>
                          {incomeSectors.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select required value={(transaction as Partial<IncomeTransaction>).fund || ''} onChange={e => handleInputChange(index, 'fund', e.target.value)} className="col-span-2 bg-white dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                          <option value="" disabled>Fund</option>
                          {incomeFunds.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </>
                    ) : (
                      <select required value={(transaction as Partial<ExpenseTransaction>).category || ''} onChange={e => handleInputChange(index, 'category', e.target.value)} className="col-span-4 bg-white dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                        <option value="" disabled>Category</option>
                        {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    )}
                    
                    <div className="col-span-2 flex justify-end">
                      <button type="button" onClick={() => handleRemoveRow(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
                <button type="button" onClick={handleAddRow} className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border-2 border-dashed border-sand-300 dark:border-dark-600 text-charcoal-600 dark:text-gray-400 hover:border-accent-teal dark:hover:text-accent-teal transition-colors">
                  <Plus size={16} />
                  <span>Add another item</span>
                </button>
              </div>

              <div className="mt-auto p-6 bg-sand-50 dark:bg-dark-900 border-t border-sand-200 dark:border-dark-600 flex items-center justify-end space-x-4">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-medium bg-sand-200 dark:bg-dark-700 text-charcoal-800 dark:text-gray-300 hover:bg-sand-300 dark:hover:bg-dark-600 transition-colors">
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit"
                  className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-2 rounded-xl font-medium shadow-soft dark:shadow-dark-soft"
                >
                  Save Transactions
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
