import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Palette, Link, CreditCard } from 'lucide-react';
import { TeamMember } from '../../types';
import { ProfileSettings } from './ProfileSettings';
import { NotificationSettings } from './NotificationSettings';
import { AppearanceSettings } from './AppearanceSettings';

interface SettingsViewProps {
  currentUser: TeamMember;
  onUpdateUser: (user: TeamMember) => void;
}

type SettingsSection = 'profile' | 'notifications' | 'appearance' | 'integrations' | 'billing';

const settingSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: Link },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, onUpdateUser }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings currentUser={currentUser} onSave={onUpdateUser} />;
      case 'notifications':
        return <NotificationSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      default:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h2 className="text-section font-semibold text-charcoal-900 dark:text-white mb-1">{settingSections.find(s => s.id === activeSection)?.label}</h2>
            <p className="text-charcoal-600 dark:text-gray-400">This section is coming soon.</p>
          </motion.div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-header font-semibold text-charcoal-900 dark:text-white mb-2">Settings</h1>
        <p className="text-charcoal-600 dark:text-gray-400">Manage your account and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-4 border border-transparent dark:border-dark-600 space-y-1">
            {settingSections.map(section => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${isActive ? 'bg-sand-100 dark:bg-dark-700 text-accent-teal font-semibold' : 'text-charcoal-700 dark:text-gray-300 hover:bg-sand-50 dark:hover:bg-dark-700/50'}`}
                >
                  <Icon size={20} className={isActive ? 'text-accent-teal' : 'text-charcoal-500 dark:text-gray-400'} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="lg:col-span-3">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};
