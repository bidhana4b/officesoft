import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TeamMember } from '../../types';
import { UploadCloud } from 'lucide-react';

interface ProfileSettingsProps {
  currentUser: TeamMember;
  onSave: (updatedUser: TeamMember) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ currentUser, onSave }) => {
  const [formData, setFormData] = useState(currentUser);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    // In a real app, you'd also handle password change logic here
    alert('Profile saved!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-section font-semibold text-charcoal-900 dark:text-white mb-1">Profile</h2>
      <p className="text-charcoal-600 dark:text-gray-400 mb-6">Manage your personal information and password.</p>

      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft border border-sand-200 dark:border-dark-600">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img src={formData.avatar} alt={formData.name} className="w-24 h-24 rounded-full object-cover" />
                <label htmlFor="avatar-upload" className="cursor-pointer absolute bottom-0 right-0 bg-accent-teal text-white p-2 rounded-full hover:bg-accent-teal-dark transition-colors">
                  <UploadCloud size={16} />
                  <input id="avatar-upload" type="file" className="hidden" />
                </label>
              </div>
              <div>
                <h3 className="text-large font-semibold text-charcoal-900 dark:text-white">{formData.name}</h3>
                <p className="text-charcoal-600 dark:text-gray-400">{formData.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-sand-100 dark:border-dark-700">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Email Address</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Role</label>
                <input type="text" name="role" id="role" value={formData.role} onChange={handleChange} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Phone Number</label>
                <input type="tel" name="phone" id="phone" value={formData.phone || ''} onChange={handleChange} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
              </div>
            </div>

            <div className="pt-6 border-t border-sand-100 dark:border-dark-700">
              <h3 className="font-medium text-charcoal-800 dark:text-gray-200 mb-4">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">New Password</label>
                  <input type="password" name="newPassword" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                  <input type="password" name="confirmPassword" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 bg-sand-50 dark:bg-dark-900/50 border-t border-sand-200 dark:border-dark-600 flex justify-end">
            <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-2 rounded-xl font-medium shadow-soft">
              Save Changes
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};
