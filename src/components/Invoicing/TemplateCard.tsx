import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { InvoiceTemplate } from '../../types';
import { useClickOutside } from '../../hooks/useClickOutside';

interface TemplateCardProps {
  template: InvoiceTemplate;
  index: number;
  onEdit: (template: InvoiceTemplate) => void;
  onDelete: (templateId: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, index, onEdit, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsMenuOpen(false));

  const isDarkBg = template.backgroundColor === '#1E1E1E';
  const textColor = isDarkBg ? 'text-gray-300' : 'text-charcoal-700';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft border border-transparent dark:border-dark-600 flex flex-col overflow-hidden"
    >
      {/* Preview */}
      <div className="p-4 h-48" style={{ backgroundColor: template.backgroundColor }}>
        <div className="flex justify-between items-start">
          <div className="w-8 h-8 rounded bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            {template.logoUrl ? <img src={template.logoUrl} alt="logo" className="w-6 h-6 object-contain" /> : <span className="text-xs font-bold">L</span>}
          </div>
          <div className="text-right">
            <h4 className="font-bold text-sm" style={{ color: template.accentColor }}>INVOICE</h4>
            <div className="w-12 h-1 mt-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
        </div>
        <div className="mt-4 h-1 w-full bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="mt-2 h-1 w-3/4 bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="mt-4 h-1 w-full bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="mt-2 h-1 w-full bg-gray-300 dark:bg-gray-600 rounded-full" />
      </div>

      {/* Info */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-charcoal-900 dark:text-white">{template.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: template.accentColor }} />
            <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: template.backgroundColor }} />
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setIsMenuOpen(o => !o)} className="p-2 text-charcoal-500 dark:text-gray-400 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg">
            <MoreHorizontal size={20} />
          </button>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-dark-700 rounded-xl shadow-lg z-10 p-2 border border-sand-200 dark:border-dark-600"
              >
                <button onClick={() => { onEdit(template); setIsMenuOpen(false); }} className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sand-100 dark:hover:bg-dark-600 text-charcoal-700 dark:text-gray-200">
                  <Edit size={16} /><span>Edit</span>
                </button>
                <button onClick={() => { onDelete(template.id); setIsMenuOpen(false); }} className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sand-100 dark:hover:bg-dark-600 text-red-500 dark:text-red-400">
                  <Trash2 size={16} /><span>Delete</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
