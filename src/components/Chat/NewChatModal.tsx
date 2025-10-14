import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { TeamMember } from '../../types';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: TeamMember) => void;
  teamMembers: TeamMember[];
  currentUser: TeamMember;
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

export const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose, onSelectUser, teamMembers, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const availableMembers = teamMembers
    .filter(m => m.id !== currentUser.id)
    .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg w-full max-w-md max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-sand-200 dark:border-dark-600">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">New Chat</h2>
                <button type="button" onClick={onClose} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg">
                  <X size={20} className="text-charcoal-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-teal"
                />
              </div>
            </div>

            <div className="flex-1 p-2 overflow-y-auto">
              {availableMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => onSelectUser(member)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-sand-100 dark:hover:bg-dark-700 transition-colors"
                >
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-medium text-charcoal-800 dark:text-gray-200 text-left">{member.name}</p>
                    <p className="text-sm text-charcoal-500 dark:text-gray-400 text-left">{member.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
