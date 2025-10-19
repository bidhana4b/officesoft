import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign } from 'lucide-react';
import { AdAccount } from '../../../types';

interface RechargeAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: AdAccount, amountUSD: number, costBDT: number, rate: number) => void;
  adAccount: AdAccount | null;
}

const modalVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } };
const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };

export const RechargeAccountModal: React.FC<RechargeAccountModalProps> = ({ isOpen, onClose, onSave, adAccount }) => {
  const [amountUSD, setAmountUSD] = useState(0);
  const [costBDT, setCostBDT] = useState(0);
  const [rate, setRate] = useState(0);

  useEffect(() => {
    if (costBDT > 0 && amountUSD > 0) {
      setRate(parseFloat((costBDT / amountUSD).toFixed(2)));
    } else {
      setRate(0);
    }
  }, [costBDT, amountUSD]);

  useEffect(() => {
    if (!isOpen) {
      setAmountUSD(0);
      setCostBDT(0);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adAccount || amountUSD <= 0 || costBDT <= 0) return;
    onSave(adAccount, amountUSD, costBDT, rate);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div variants={backdropVariants} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div variants={modalVariants} className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-sand-200 dark:border-dark-600 flex items-center justify-between">
                <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">Recharge {adAccount?.name}</h2>
                <button type="button" onClick={onClose} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Amount (USD)</label>
                    <input type="number" value={amountUSD} onChange={e => setAmountUSD(parseFloat(e.target.value))} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Total Cost (BDT)</label>
                    <input type="number" value={costBDT} onChange={e => setCostBDT(parseFloat(e.target.value))} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                </div>
                <div className="p-4 bg-sand-100 dark:bg-dark-700 rounded-xl text-center">
                  <p className="text-sm text-charcoal-500 dark:text-gray-400">Calculated Cost Rate (BDT per USD)</p>
                  <p className="text-2xl font-bold text-accent-orange">{rate > 0 ? rate.toLocaleString('en-US', { style: 'currency', currency: 'BDT' }) : '---'}</p>
                </div>
              </div>
              <div className="p-6 bg-sand-50 dark:bg-dark-900 border-t border-sand-200 dark:border-dark-600 flex justify-end space-x-4">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-medium bg-sand-200 dark:bg-dark-700">Cancel</button>
                <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-2 rounded-xl font-medium shadow-soft flex items-center space-x-2">
                    <DollarSign size={18} />
                    <span>Confirm Recharge</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
