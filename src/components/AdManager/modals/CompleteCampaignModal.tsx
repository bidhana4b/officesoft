import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { Campaign, AdAccount } from '../../../types';

interface CompleteCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (campaign: Campaign, spend: number, adAccountId: string) => void;
  campaign: Campaign | null;
  adAccounts: AdAccount[];
}

const modalVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } };
const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };

export const CompleteCampaignModal: React.FC<CompleteCampaignModalProps> = ({ isOpen, onClose, onComplete, campaign, adAccounts }) => {
  const [spend, setSpend] = useState(0);
  const [adAccountId, setAdAccountId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && campaign) {
      setSpend(campaign.budgetUSD); // Default to budget
      const platformAccounts = adAccounts.filter(acc => acc.platformId === campaign.platformId);
      if (platformAccounts.length > 0) {
        setAdAccountId(platformAccounts[0].id);
      }
    }
  }, [campaign, isOpen, adAccounts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!campaign || spend <= 0 || !adAccountId) {
      setError('Please provide a valid spend and select an ad account.');
      return;
    }
    onComplete(campaign, spend, adAccountId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div variants={backdropVariants} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div variants={modalVariants} className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-sand-200 dark:border-dark-600 flex items-center justify-between">
                <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">Complete Campaign</h2>
                <button type="button" onClick={onClose} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-6">
                <p>You are marking <strong className="text-accent-teal">{campaign?.name}</strong> as complete. Please enter the final ad spend.</p>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Actual Spend (USD)</label>
                  <input type="number" value={spend} onChange={e => setSpend(parseFloat(e.target.value))} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Ad Account Used</label>
                  <select value={adAccountId} onChange={e => setAdAccountId(e.target.value)} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                    <option value="" disabled>Select account</option>
                    {adAccounts.filter(acc => acc.platformId === campaign?.platformId).map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name} (${acc.balanceUSD.toFixed(2)})</option>
                    ))}
                  </select>
                </div>
                 {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <div className="p-6 bg-sand-50 dark:bg-dark-900 border-t border-sand-200 dark:border-dark-600 flex justify-end space-x-4">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-medium bg-sand-200 dark:bg-dark-700">Cancel</button>
                <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-xl font-medium shadow-soft flex items-center space-x-2">
                    <CheckCircle size={18} />
                    <span>Confirm & Calculate Profit</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
