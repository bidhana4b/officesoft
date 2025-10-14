import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer, Download, Edit } from 'lucide-react';
import { Invoice, InvoiceTemplate } from '../../types';
import { mockInvoiceTemplates } from '../../data/mockData';
import { useTheme } from '../../contexts/ThemeContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface InvoiceDetailsProps {
  invoice: Invoice;
  onBack: () => void;
  onEdit: (invoice: Invoice) => void;
}

export const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, onBack, onEdit }) => {
  const { isDarkMode } = useTheme();
  const [templates] = useLocalStorage<InvoiceTemplate[]>('invoiceTemplates', mockInvoiceTemplates);
  
  const template = templates.find(t => t.id === invoice.templateId) || templates[0] || mockInvoiceTemplates[0];

  const { subtotal, tax, total } = React.useMemo(() => {
    const subtotal = invoice.lineItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const tax = subtotal * 0.08; // 8% tax, example
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [invoice.lineItems]);

  const getStatusChip = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'draft':
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const isDarkBg = template.backgroundColor === '#1E1E1E';
  const textColor = isDarkBg ? 'text-gray-200' : 'text-charcoal-800';
  const mutedTextColor = isDarkBg ? 'text-gray-400' : 'text-charcoal-600';
  const strongTextColor = isDarkBg ? 'text-white' : 'text-charcoal-900';
  const tableHeadBg = isDarkBg ? 'bg-dark-700' : 'bg-sand-50';
  const borderColor = isDarkBg ? 'dark:border-dark-600' : 'border-sand-200';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg">
            <ArrowLeft size={20} className="text-charcoal-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-header font-semibold text-charcoal-900 dark:text-white">Invoice {invoice.id}</h1>
            <p className="text-charcoal-600 dark:text-gray-400">For {invoice.client.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium bg-sand-100 dark:bg-dark-700 text-charcoal-800 dark:text-gray-300 hover:bg-sand-200 dark:hover:bg-dark-600">
            <Printer size={16} /><span>Print</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium bg-sand-100 dark:bg-dark-700 text-charcoal-800 dark:text-gray-300 hover:bg-sand-200 dark:hover:bg-dark-600">
            <Download size={16} /><span>Download</span>
          </motion.button>
          <motion.button onClick={() => onEdit(invoice)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white">
            <Edit size={16} /><span>Edit</span>
          </motion.button>
        </div>
      </div>

      {/* Invoice Template */}
      <div 
        className="rounded-2xl shadow-soft dark:shadow-dark-soft p-10 border border-transparent dark:border-dark-600"
        style={{ backgroundColor: template.backgroundColor }}
      >
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            {template.logoUrl ? (
              <img src={template.logoUrl} alt="Company Logo" className="h-10 mb-2" />
            ) : (
              <h2 className={`text-2xl font-bold ${strongTextColor}`}>StudioBoard Inc.</h2>
            )}
            <p className={mutedTextColor}>123 Creative Lane<br />Design City, DS 54321</p>
          </div>
          <div className="text-right">
            <h1 className={`text-4xl font-bold tracking-wider`} style={{color: template.accentColor}}>INVOICE</h1>
            <p className={`${mutedTextColor} mt-1`}>{invoice.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <p className={`text-sm font-semibold ${mutedTextColor}`}>BILL TO</p>
            <p className={`font-bold ${strongTextColor}`}>{invoice.client.name}</p>
            <p className={mutedTextColor}>{invoice.client.contactPerson.name}</p>
            <p className={mutedTextColor}>{invoice.client.email}</p>
          </div>
          <div className="text-right">
            <p className={`text-sm font-semibold ${mutedTextColor}`}>Status</p>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusChip(invoice.status)}`}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
            <p className={`text-sm font-semibold ${mutedTextColor} mt-4`}>Issue Date</p>
            <p className={textColor}>{new Date(invoice.issueDate).toLocaleDateString()}</p>
            <p className={`text-sm font-semibold ${mutedTextColor} mt-2`}>Due Date</p>
            <p className={textColor}>{new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>

        <table className="w-full text-left mb-10">
          <thead style={{ backgroundColor: isDarkBg ? 'rgba(255,255,255,0.05)' : template.accentColor + '1A' }}>
            <tr>
              <th className={`p-3 text-sm font-semibold rounded-l-lg`} style={{color: template.accentColor}}>Description</th>
              <th className={`p-3 text-sm font-semibold text-center`} style={{color: template.accentColor}}>Qty</th>
              <th className={`p-3 text-sm font-semibold text-right`} style={{color: template.accentColor}}>Unit Price</th>
              <th className={`p-3 text-sm font-semibold text-right rounded-r-lg`} style={{color: template.accentColor}}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map(item => (
              <tr key={item.id} className={`border-b`} style={{ borderColor: isDarkBg ? 'rgba(255,255,255,0.1)' : '#F5F4F1' }}>
                <td className={`p-3 ${textColor}`}>{item.description}</td>
                <td className={`p-3 ${mutedTextColor} text-center`}>{item.quantity}</td>
                <td className={`p-3 ${mutedTextColor} text-right`}>${item.price.toLocaleString()}</td>
                <td className={`p-3 ${textColor} font-medium text-right`}>${(item.quantity * item.price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-full max-w-sm space-y-3">
            <div className="flex justify-between">
              <span className={mutedTextColor}>Subtotal</span>
              <span className={`font-medium ${textColor}`}>${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between">
              <span className={mutedTextColor}>Tax (8%)</span>
              <span className={`font-medium ${textColor}`}>${tax.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            <div className={`flex justify-between text-xl font-bold pt-3 border-t`} style={{ borderColor: isDarkBg ? 'rgba(255,255,255,0.1)' : '#E8E6E1' }}>
              <span className={strongTextColor}>Total Due</span>
              <span style={{color: template.accentColor}}>${total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
          </div>
        </div>

        {(invoice.notes || template.footerText) && (
          <div className={`mt-10 pt-6 border-t`} style={{ borderColor: isDarkBg ? 'rgba(255,255,255,0.1)' : '#E8E6E1' }}>
            <h4 className={`text-sm font-semibold ${mutedTextColor} mb-2`}>Notes</h4>
            <p className={`${mutedTextColor} text-sm`}>{invoice.notes || template.footerText}</p>
          </div>
        )}
      </div>
    </div>
  );
};
