import React from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const Switch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${checked ? 'bg-accent-teal' : 'bg-sand-200 dark:bg-dark-600'}`}
  >
    <motion.span
      layout
      transition={{ type: 'spring', stiffness: 700, damping: 30 }}
      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
    />
  </button>
);

export const NotificationSettings: React.FC = () => {
  const [prefs, setPrefs] = useLocalStorage('notificationPrefs', {
    taskAssigned: { email: true, push: true },
    commentMention: { email: true, push: true },
    projectUpdate: { email: false, push: true },
    invoicePaid: { email: true, push: false },
  });

  const handleToggle = (category: keyof typeof prefs, type: 'email' | 'push') => {
    setPrefs(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type],
      },
    }));
  };

  const notificationItems = [
    { key: 'taskAssigned', label: 'A task is assigned to you' },
    { key: 'commentMention', label: 'You are mentioned in a comment' },
    { key: 'projectUpdate', label: 'A project status is updated' },
    { key: 'invoicePaid', label: 'An invoice is paid' },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-section font-semibold text-charcoal-900 dark:text-white mb-1">Notifications</h2>
      <p className="text-charcoal-600 dark:text-gray-400 mb-6">Manage how you receive notifications from the app.</p>

      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-2 border border-sand-200 dark:border-dark-600">
        <table className="w-full">
          <thead>
            <tr className="border-b border-sand-100 dark:border-dark-700">
              <th className="p-4 text-left text-sm font-medium text-charcoal-600 dark:text-gray-400">Activity</th>
              <th className="p-4 w-24 text-center text-sm font-medium text-charcoal-600 dark:text-gray-400">Email</th>
              <th className="p-4 w-24 text-center text-sm font-medium text-charcoal-600 dark:text-gray-400">Push</th>
            </tr>
          </thead>
          <tbody>
            {notificationItems.map(({ key, label }, index) => (
              <tr key={key} className={`border-b border-sand-100 dark:border-dark-700 last:border-0`}>
                <td className="p-4 text-charcoal-800 dark:text-gray-200">{label}</td>
                <td className="p-4 text-center">
                  <Switch checked={prefs[key].email} onChange={() => handleToggle(key, 'email')} />
                </td>
                <td className="p-4 text-center">
                  <Switch checked={prefs[key].push} onChange={() => handleToggle(key, 'push')} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
