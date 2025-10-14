import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Invoice, InvoiceLineItem, Client, InvoiceTemplate } from '../../types';
import { mockClients, mockInvoiceTemplates } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface InvoiceEditorProps {
  invoice: Invoice | null;
  onSave: (invoice: Invoice) => void;
  onBack: () => void;
}

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ invoice, onSave, onBack }) => {
  const [formData, setFormData] = useState<Partial<Invoice>>({});
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([]);
  const [templates] = useLocalStorage<InvoiceTemplate[]>('invoiceTemplates', mockInvoiceTemplates);

  useEffect(() => {
    if (invoice) {
      setFormData(invoice);
      setLineItems(invoice.lineItems);
    } else {
      const nextInvoiceNumber = 'INV-2025-004'; // Placeholder logic
      setFormData({
        id: nextInvoiceNumber,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        templateId: templates[0]?.id || mockInvoiceTemplates[0].id, // Default to first template
      });
      setLineItems([{ id: crypto.randomUUID(), description: '', quantity: 1, price: 0 }]);
    }
  }, [invoice, templates]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLineItemChange = (index: number, field: keyof InvoiceLineItem, value: string | number) => {
    const updatedItems = [...lineItems];
    (updatedItems[index] as any)[field] = value;
    setLineItems(updatedItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { id: crypto.randomUUID(), description: '', quantity: 1, price: 0 }]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const tax = subtotal * 0.08; // 8% tax, example
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [lineItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = mockClients.find(c => c.id === formData.clientId);
    if (!formData.id || !selectedClient) return;

    const finalInvoice: Invoice = {
      id: formData.id,
      clientId: selectedClient.id,
      client: selectedClient,
      issueDate: formData.issueDate!,
      dueDate: formData.dueDate!,
      lineItems: lineItems.filter(item => item.description),
      status: formData.status!,
      notes: formData.notes,
      templateId: formData.templateId,
    };
    onSave(finalInvoice);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg">
          <ArrowLeft size={20} className="text-charcoal-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-header font-semibold text-charcoal-900 dark:text-white">
            {invoice ? `Edit Invoice ${invoice.id}` : 'Create New Invoice'}
          </h1>
          <p className="text-charcoal-600 dark:text-gray-400">Fill in the details below.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft border border-transparent dark:border-dark-600">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Client</label>
              <select name="clientId" value={formData.clientId || ''} onChange={handleInputChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                <option value="" disabled>Select a client</option>
                {mockClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Issue Date</label>
              <input type="date" name="issueDate" value={formData.issueDate || ''} onChange={handleInputChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Due Date</label>
              <input type="date" name="dueDate" value={formData.dueDate || ''} onChange={handleInputChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Template</label>
              <select name="templateId" value={formData.templateId || ''} onChange={handleInputChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <h3 className="font-semibold text-charcoal-800 dark:text-gray-200">Items</h3>
            {lineItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                <input type="text" placeholder="Item description" value={item.description} onChange={e => handleLineItemChange(index, 'description', e.target.value)} className="col-span-6 bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                <input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleLineItemChange(index, 'quantity', parseInt(e.target.value))} className="col-span-2 bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                <input type="number" placeholder="Price" value={item.price} onChange={e => handleLineItemChange(index, 'price', parseFloat(e.target.value))} className="col-span-2 bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
                <span className="col-span-1 text-right text-charcoal-700 dark:text-gray-300">${(item.quantity * item.price).toLocaleString()}</span>
                <button type="button" onClick={() => removeLineItem(item.id)} className="col-span-1 p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg justify-self-end">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addLineItem} className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-dashed border-sand-300 dark:border-dark-600 text-charcoal-600 dark:text-gray-400 hover:border-accent-teal dark:hover:text-accent-teal transition-colors">
              <Plus size={16} />
              <span>Add Item</span>
            </button>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-sand-200 dark:border-dark-600">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Notes</label>
              <textarea name="notes" value={formData.notes || ''} onChange={handleInputChange} rows={4} className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" placeholder="Thank you for your business..."></textarea>
            </div>
            <div className="space-y-2 text-right">
              <div className="flex justify-between items-center">
                <span className="text-charcoal-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium text-charcoal-800 dark:text-gray-200">${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-600 dark:text-gray-400">Tax (8%)</span>
                <span className="font-medium text-charcoal-800 dark:text-gray-200">${tax.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between items-center text-lg pt-2 border-t border-sand-200 dark:border-dark-600">
                <span className="font-semibold text-charcoal-900 dark:text-white">Total</span>
                <span className="font-bold text-charcoal-900 dark:text-white">${total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-sand-50 dark:bg-dark-900 border-t border-sand-200 dark:border-dark-600 flex items-center justify-end space-x-4">
          <button type="button" onClick={onBack} className="px-6 py-2 rounded-xl font-medium bg-sand-200 dark:bg-dark-700 text-charcoal-800 dark:text-gray-300 hover:bg-sand-300 dark:hover:bg-dark-600 transition-colors">
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-2 rounded-xl font-medium shadow-soft dark:shadow-dark-soft"
          >
            Save Invoice
          </motion.button>
        </div>
      </form>
    </div>
  );
};
