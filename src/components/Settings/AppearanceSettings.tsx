import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const AppearanceSettings: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-section font-semibold text-charcoal-900 dark:text-white mb-1">Appearance</h2>
      <p className="text-charcoal-600 dark:text-gray-400 mb-6">Customize how StudioBoard looks and feels.</p>

      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-sand-200 dark:border-dark-600">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-charcoal-800 dark:text-gray-200">Interface Theme</h3>
            <p className="text-sm text-charcoal-600 dark:text-gray-400">
              Choose between light and dark mode.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-sand-100 dark:bg-dark-700 p-1 rounded-lg">
            <button
              onClick={() => isDarkMode && toggleDarkMode()}
              className={`p-2 rounded-md transition-colors ${!isDarkMode ? 'bg-white shadow text-accent-teal' : 'text-charcoal-500'}`}
            >
              <Sun size={20} />
            </button>
            <button
              onClick={() => !isDarkMode && toggleDarkMode()}
              className={`p-2 rounded-md transition-colors ${isDarkMode ? 'bg-dark-800 shadow text-accent-teal' : 'text-charcoal-500'}`}
            >
              <Moon size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
