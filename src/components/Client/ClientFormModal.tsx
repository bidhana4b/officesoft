import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Client } from '../../types';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  client: Client | null;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const ClientFormModal: React.FC<ClientFormModalProps> = ({ isOpen, onClose, onSave, client }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      if (client) {
        setFormData({
          ...client,
          services: client.services.join(', '),
          contactName: client.contactPerson.name,
          contactTitle: client.contactPerson.title,
        });
      } else {
        setFormData({
          name: '',
          contactName: '',
          contactTitle: '',
          email: '',
          phone: '',
          status: 'onboarding',
          services: '',
          logo: `https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=100&h=100&fit=crop`,
        });
      }
    }
  }, [client, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalClient: Client = {
      id: client?.id || crypto.randomUUID(),
      name: formData.name || '',
      logo: formData.logo || '',
      contactPerson: {
        name: formData.contactName || '',
        title: formData.contactTitle || '',
      },
      email: formData.email || '',
      phone: formData.phone || '',
      status: formData.status || 'onboarding',
      activeProjects: client?.activeProjects || 0,
      totalBilled: client?.totalBilled || 0,
      services: typeof formData.services === 'string' ? formData.services.split(',').map(s => s.trim()).filter(Boolean) : [],
    };
    onSave(finalClient);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-sand-200 dark:border-dark-600 flex items-center justify-between">
                <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">
                  {client ? 'Edit Client' : 'Add New Client'}
                </h2>
                <button type="button" onClick={onClose} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg">
                  <X size={20} className="text-charcoal-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Client Name</label>
                    <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Status</label>
                    <select name="status" id="status" value={formData.status || 'onboarding'} onChange={handleChange} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                      <option value="active">Active</option>
                      <option value="onboarding">Onboarding</option>
                      <option value="churned">Churned</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Contact Name</label>
                    <input type="text" name="contactName" id="contactName" value={formData.contactName || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                  <div>
                    <label htmlFor="contactTitle" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Contact Title</label>
                    <input type="text" name="contactTitle" id="contactTitle" value={formData.contactTitle || ''} onChange={handleChange} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Email</label>
                    <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Phone</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone || ''} onChange={handleChange} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="services" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Services (comma-separated)</label>
                  <input type="text" name="services" id="services" value={formData.services || ''} onChange={handleChange} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                </div>
              </div>

              <div className="p-6 bg-sand-50 dark:bg-dark-900 border-t border-sand-200 dark:border-dark-600 flex items-center justify-end space-x-4">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-medium bg-sand-200 dark:bg-dark-700 text-charcoal-800 dark:text-gray-300 hover:bg-sand-300 dark:hover:bg-dark-600 transition-colors">
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-2 rounded-xl font-medium shadow-soft dark:shadow-dark-soft"
                >
                  Save Client
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
