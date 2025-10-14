import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Plus, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  onMenuToggle: () => void;
  currentUser: {
    name: string;
    avatar: string;
  };
  onNewProjectClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, currentUser, onNewProjectClick }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="bg-white dark:bg-dark-800 border-b border-sand-200 dark:border-dark-600 px-6 py-4 shadow-soft dark:shadow-dark-soft transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg transition-colors lg:hidden"
          >
            <Menu size={20} className="text-charcoal-600 dark:text-gray-400" />
          </button>
          
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search projects, tasks, or team members..."
              className="pl-10 pr-4 py-2 w-96 bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-teal dark:focus:ring-accent-teal-dark focus:border-transparent transition-all text-charcoal-900 dark:text-white placeholder-charcoal-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onNewProjectClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-accent-teal dark:bg-accent-teal-dark text-white px-4 py-2 rounded-xl font-medium hover:bg-opacity-90 transition-all shadow-soft dark:shadow-dark-soft flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>New Project</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-xl transition-colors"
          >
            {isDarkMode ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-charcoal-600" />
            )}
          </motion.button>

          <div className="relative">
            <button className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-xl transition-colors relative">
              <Bell size={20} className="text-charcoal-600 dark:text-gray-400" />
              <span className="absolute -top-1 -right-1 bg-accent-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-charcoal-900 dark:text-white">{currentUser.name}</p>
              <p className="text-xs text-charcoal-500 dark:text-gray-400">Creative Director</p>
            </div>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent hover:ring-accent-teal dark:hover:ring-accent-teal-dark transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
