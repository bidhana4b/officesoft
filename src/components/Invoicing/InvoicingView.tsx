import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Invoice } from '../../types';
import { mockInvoices } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { InvoiceList } from './InvoiceList';
import { InvoiceEditor } from './InvoiceEditor';
import { InvoiceDetails } from './InvoiceDetails';

type View = 'list' | 'editor' | 'details';

export const InvoicingView: React.FC = () => {
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices', mockInvoices);
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleCreateNew = () => {
    setSelectedInvoice(null);
    setCurrentView('editor');
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('editor');
  };

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('details');
  };

  const handleBackToList = () => {
    setSelectedInvoice(null);
    setCurrentView('list');
  };

  const handleSaveInvoice = (invoice: Invoice) => {
    setInvoices(prev => {
      const exists = prev.some(i => i.id === invoice.id);
      if (exists) {
        return prev.map(i => (i.id === invoice.id ? invoice : i));
      }
      return [invoice, ...prev];
    });
    handleView(invoice);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'editor':
        return (
          <InvoiceEditor
            invoice={selectedInvoice}
            onSave={handleSaveInvoice}
            onBack={handleBackToList}
          />
        );
      case 'details':
        return selectedInvoice && (
          <InvoiceDetails
            invoice={selectedInvoice}
            onBack={handleBackToList}
            onEdit={handleEdit}
          />
        );
      case 'list':
      default:
        return (
          <InvoiceList
            invoices={invoices}
            onView={handleView}
            onEdit={handleEdit}
            onCreateNew={handleCreateNew}
          />
        );
    }
  };

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
          {renderCurrentView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
