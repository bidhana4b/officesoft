import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Campaign, Client, TeamMember } from '../../../types';
import { mockAdPlatforms } from '../../../data/mockData';

interface AdRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Campaign) => void;
  campaign: Campaign | null;
  clients: Client[];
  teamMembers: TeamMember[];
  currentUser: TeamMember;
}

const modalVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } };
const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };

export const AdRequestModal: React.FC<AdRequestModalProps> = ({ isOpen, onClose, onSave, campaign, clients, teamMembers, currentUser }) => {
  const [formData, setFormData] = useState<Partial<Campaign>>({});

  useEffect(() => {
    if (isOpen) {
      if (campaign) {
        setFormData(campaign);
      } else {
        setFormData({
          name: '',
          clientId: '',
          platformId: 'facebook',
          budgetUSD: 0,
          audienceDetails: '',
        });
      }
    }
  }, [campaign, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.clientId || !formData.platformId || !formData.budgetUSD) return;

    const finalCampaign: Campaign = {
      id: campaign?.id || crypto.randomUUID(),
      name: formData.name,
      clientId: formData.clientId,
      platformId: formData.platformId as any,
      status: campaign?.status || 'pending',
      requestedById: currentUser.id,
      budgetUSD: Number(formData.budgetUSD),
      audienceDetails: formData.audienceDetails || '',
      createdAt: campaign?.createdAt || new Date().toISOString(),
    };
    onSave(finalCampaign);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div variants={backdropVariants} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div variants={modalVariants} className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-sand-200 dark:border-dark-600 flex items-center justify-between">
                <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">{campaign ? 'Edit Ad Request' : 'New Ad Request'}</h2>
                <button type="button" onClick={onClose} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Campaign Name</label>
                  <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Client</label>
                    <select name="clientId" value={formData.clientId || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                      <option value="" disabled>Select a client</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Platform</label>
                    <select name="platformId" value={formData.platformId || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                      {mockAdPlatforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Budget (USD)</label>
                  <input type="number" name="budgetUSD" value={formData.budgetUSD || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Audience Details</label>
                  <textarea name="audienceDetails" value={formData.audienceDetails || ''} onChange={handleChange} rows={3} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal"></textarea>
                </div>
              </div>
              <div className="p-6 bg-sand-50 dark:bg-dark-900 border-t border-sand-200 dark:border-dark-600 flex justify-end space-x-4">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-medium bg-sand-200 dark:bg-dark-700">Cancel</button>
                <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-2 rounded-xl font-medium shadow-soft">Save Request</motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
