import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { InvoiceTemplate } from '../../types';
import { mockInvoiceTemplates } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { TemplateEditor } from './TemplateEditor';
import { TemplateCard } from './TemplateCard';

type View = 'list' | 'editor';

export const InvoiceTemplatesView: React.FC = () => {
  const [templates, setTemplates] = useLocalStorage<InvoiceTemplate[]>('invoiceTemplates', mockInvoiceTemplates);
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate | null>(null);

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setCurrentView('editor');
  };

  const handleEdit = (template: InvoiceTemplate) => {
    setSelectedTemplate(template);
    setCurrentView('editor');
  };

  const handleBackToList = () => {
    setSelectedTemplate(null);
    setCurrentView('list');
  };

  const handleSaveTemplate = (template: InvoiceTemplate) => {
    setTemplates(prev => {
      const exists = prev.some(t => t.id === template.id);
      if (exists) {
        return prev.map(t => (t.id === template.id ? template : t));
      }
      return [template, ...prev];
    });
    handleBackToList();
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };
  
  const renderListView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-header font-semibold text-charcoal-900 dark:text-white mb-2">Invoice Templates</h1>
          <p className="text-charcoal-600 dark:text-gray-400">Create and manage your invoice designs.</p>
        </div>
        <motion.button
          onClick={handleCreateNew}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-3 rounded-xl font-medium hover:shadow-hover dark:hover:shadow-dark-hover transition-all shadow-soft dark:shadow-dark-soft flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Template</span>
        </motion.button>
      </div>
      {templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              index={index}
              onEdit={handleEdit}
              onDelete={handleDeleteTemplate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft border border-transparent dark:border-dark-600">
          <h3 className="text-lg font-semibold text-charcoal-800 dark:text-gray-200">No Templates Found</h3>
          <p className="text-charcoal-600 dark:text-gray-400 mt-2 mb-6">Get started by creating your first invoice design.</p>
          <motion.button
            onClick={handleCreateNew}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-3 rounded-xl font-medium hover:shadow-hover dark:hover:shadow-dark-hover transition-all shadow-soft dark:shadow-dark-soft flex items-center space-x-2 mx-auto"
          >
            <Plus size={20} />
            <span>Create New Template</span>
          </motion.button>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentView === 'list' ? renderListView() : (
            <TemplateEditor
              template={selectedTemplate}
              onSave={handleSaveTemplate}
              onBack={handleBackToList}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
