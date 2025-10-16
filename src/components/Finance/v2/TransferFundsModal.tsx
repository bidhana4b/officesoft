import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Fund } from '../../../types';

interface TransferFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (fromFundId: string, toFundId: string, amount: number) => void;
  funds: Fund[];
}

const modalVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } };
const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };

export const TransferFundsModal: React.FC<TransferFundsModalProps> = ({ isOpen, onClose, onTransfer, funds }) => {
  const [fromFundId, setFromFundId] = useState('');
  const [toFundId, setToFundId] = useState('');
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (funds.length > 0) setFromFundId(funds[0].id);
      if (funds.length > 1) setToFundId(funds[1].id);
      setAmount(0);
      setError('');
    }
  }, [isOpen, funds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!fromFundId || !toFundId || amount <= 0) {
        setError('Please fill all fields and enter a positive amount.');
        return;
    }
    if (fromFundId === toFundId) {
        setError('Cannot transfer to the same fund.');
        return;
    }
    const fromFund = funds.find(f => f.id === fromFundId);
    if (fromFund && fromFund.balance < amount) {
        setError('Insufficient balance in the source fund.');
        return;
    }
    
    onTransfer(fromFundId, toFundId, amount);
  };

  const availableToFunds = funds.filter(f => f.id !== fromFundId);

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
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-sand-200 dark:border-dark-600 flex items-center justify-between">
                <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">Transfer Funds</h2>
                <button type="button" onClick={onClose} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg">
                  <X size={20} className="text-charcoal-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Amount</label>
                  <input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">From</label>
                    <select value={fromFundId} onChange={e => setFromFundId(e.target.value)} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                      {funds.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <div className="pt-8">
                    <ArrowRight size={20} className="text-charcoal-400" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">To</label>
                    <select value={toFundId} onChange={e => setToFundId(e.target.value)} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                      {availableToFunds.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <div className="p-6 bg-sand-50 dark:bg-dark-900 border-t border-sand-200 dark:border-dark-600 flex items-center justify-end space-x-4">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-medium bg-sand-200 dark:bg-dark-700 text-charcoal-800 dark:text-gray-300 hover:bg-sand-300 dark:hover:bg-dark-600 transition-colors">
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit"
                  className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-2 rounded-xl font-medium shadow-soft dark:shadow-dark-soft"
                >
                  Confirm Transfer
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
