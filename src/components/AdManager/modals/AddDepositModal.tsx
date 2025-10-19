import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign } from 'lucide-react';
import { Client } from '../../../types';

interface AddDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client, amountUSD: number, amountBDT: number, rate: number) => void;
  client: Client | null;
}

const modalVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } };
const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };

export const AddDepositModal: React.FC<AddDepositModalProps> = ({ isOpen, onClose, onSave, client }) => {
  const [amountBDT, setAmountBDT] = useState(0);
  const [rate, setRate] = useState(client?.avgDepositRate || 150);
  const [amountUSD, setAmountUSD] = useState(0);

  useEffect(() => {
    if (rate > 0) {
      setAmountUSD(parseFloat((amountBDT / rate).toFixed(2)));
    }
  }, [amountBDT, rate]);

  useEffect(() => {
    if (client) {
      setRate(client.avgDepositRate || 150);
    }
    setAmountBDT(0);
  }, [isOpen, client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || amountBDT <= 0 || rate <= 0) return;
    onSave(client, amountUSD, amountBDT, rate);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div variants={backdropVariants} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div variants={modalVariants} className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-sand-200 dark:border-dark-600 flex items-center justify-between">
                <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">Add Deposit for {client?.name}</h2>
                <button type="button" onClick={onClose} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Amount (BDT)</label>
                    <input type="number" value={amountBDT} onChange={e => setAmountBDT(parseFloat(e.target.value))} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Rate (BDT per USD)</label>
                    <input type="number" step="0.01" value={rate} onChange={e => setRate(parseFloat(e.target.value))} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                </div>
                <div className="p-4 bg-sand-100 dark:bg-dark-700 rounded-xl text-center">
                  <p className="text-sm text-charcoal-500 dark:text-gray-400">Equivalent Amount (USD)</p>
                  <p className="text-2xl font-bold text-accent-teal">{amountUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                </div>
              </div>
              <div className="p-6 bg-sand-50 dark:bg-dark-900 border-t border-sand-200 dark:border-dark-600 flex justify-end space-x-4">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-medium bg-sand-200 dark:bg-dark-700">Cancel</button>
                <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-2 rounded-xl font-medium shadow-soft flex items-center space-x-2">
                    <DollarSign size={18} />
                    <span>Confirm Deposit</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
