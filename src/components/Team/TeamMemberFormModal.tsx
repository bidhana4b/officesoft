import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { TeamMember } from '../../types';

interface TeamMemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: TeamMember) => void;
  member: TeamMember | null;
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

const departments = ['Design', 'Development', 'Management', 'Marketing', 'QA'];

export const TeamMemberFormModal: React.FC<TeamMemberFormModalProps> = ({ isOpen, onClose, onSave, member }) => {
  const [formData, setFormData] = useState<Partial<TeamMember>>({});

  useEffect(() => {
    if (isOpen) {
      if (member) {
        setFormData(member);
      } else {
        setFormData({
          name: '',
          role: '',
          email: '',
          department: 'Design',
          status: 'online',
          avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face`,
        });
      }
    }
  }, [member, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.email) return;

    const finalMember: TeamMember = {
      id: member?.id || crypto.randomUUID(),
      name: formData.name,
      role: formData.role,
      email: formData.email,
      department: formData.department || 'Design',
      status: formData.status || 'online',
      avatar: formData.avatar || '',
    };
    onSave(finalMember);
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
                  {member ? 'Edit Team Member' : 'Add New Member'}
                </h2>
                <button type="button" onClick={onClose} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg">
                  <X size={20} className="text-charcoal-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Role / Title</label>
                    <input type="text" name="role" id="role" value={formData.role || ''} onChange={handleChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                  </div>
                   <div>
                    <label htmlFor="department" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Department</label>
                    <select name="department" id="department" value={formData.department || 'Design'} onChange={handleChange} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                      {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="avatar" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Avatar URL</label>
                  <input type="text" name="avatar" id="avatar" value={formData.avatar || ''} onChange={handleChange} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
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
                  Save Member
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
