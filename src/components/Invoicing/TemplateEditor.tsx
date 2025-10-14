import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Palette, FileImage, Type } from 'lucide-react';
import { InvoiceTemplate } from '../../types';

interface TemplateEditorProps {
  template: InvoiceTemplate | null;
  onSave: (template: InvoiceTemplate) => void;
  onBack: () => void;
}

const defaultTemplate: Omit<InvoiceTemplate, 'id' | 'name'> = {
  accentColor: '#4A9B8E',
  backgroundColor: '#FFFFFF',
  logoUrl: '',
  footerText: 'Thank you for your business!',
};

export const TemplateEditor: React.FC<TemplateEditorProps> = ({ template, onSave, onBack }) => {
  const [formData, setFormData] = useState<Partial<InvoiceTemplate>>(template || defaultTemplate);

  useEffect(() => {
    if (template) {
      setFormData(template);
    } else {
      setFormData({
        name: '',
        ...defaultTemplate,
      });
    }
  }, [template]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const finalTemplate: InvoiceTemplate = {
      id: template?.id || crypto.randomUUID(),
      name: formData.name,
      accentColor: formData.accentColor || defaultTemplate.accentColor,
      backgroundColor: formData.backgroundColor || defaultTemplate.backgroundColor,
      logoUrl: formData.logoUrl,
      footerText: formData.footerText,
    };
    onSave(finalTemplate);
  };

  const isDarkBg = formData.backgroundColor === '#1E1E1E';
  const textColor = isDarkBg ? 'text-gray-200' : 'text-charcoal-800';
  const mutedTextColor = isDarkBg ? 'text-gray-400' : 'text-charcoal-600';
  const strongTextColor = isDarkBg ? 'text-white' : 'text-charcoal-900';

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg">
          <ArrowLeft size={20} className="text-charcoal-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-header font-semibold text-charcoal-900 dark:text-white">
            {template ? `Edit Template` : 'Create New Template'}
          </h1>
          <p className="text-charcoal-600 dark:text-gray-400">Customize your invoice design.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Form */}
        <div className="lg:col-span-1 bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft border border-transparent dark:border-dark-600 p-6 space-y-6 self-start">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Template Name</label>
            <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} required className="w-full bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Accent Color</label>
              <div className="relative">
                <Palette size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input type="color" value={formData.accentColor || '#4A9B8E'} onChange={e => handleInputChange(e)} name="accentColor" className="w-full h-12 p-0 pl-10 border-none rounded-xl bg-sand-50 dark:bg-dark-700 cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Background</label>
              <div className="relative">
                <Palette size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input type="color" value={formData.backgroundColor || '#FFFFFF'} onChange={e => handleInputChange(e)} name="backgroundColor" className="w-full h-12 p-0 pl-10 border-none rounded-xl bg-sand-50 dark:bg-dark-700 cursor-pointer" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Logo URL</label>
            <div className="relative">
              <FileImage size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input type="text" name="logoUrl" placeholder="https://example.com/logo.png" value={formData.logoUrl || ''} onChange={handleInputChange} className="w-full pl-10 bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-gray-300 mb-2">Footer Text</label>
            <div className="relative">
              <Type size={16} className="absolute left-3 top-4 text-charcoal-400" />
              <textarea name="footerText" value={formData.footerText || ''} onChange={handleInputChange} rows={3} className="w-full pl-10 bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-teal" />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-sand-200 dark:border-dark-600">
            <button type="button" onClick={onBack} className="px-6 py-2 rounded-xl font-medium bg-sand-200 dark:bg-dark-700 text-charcoal-800 dark:text-gray-300 hover:bg-sand-300 dark:hover:bg-dark-600">Cancel</button>
            <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-2 rounded-xl font-medium shadow-soft">Save Template</motion.button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-charcoal-800 dark:text-gray-200 mb-4">Live Preview</h3>
          <div className="rounded-2xl shadow-lg overflow-hidden border border-sand-200 dark:border-dark-600">
            <div className="p-10" style={{ backgroundColor: formData.backgroundColor || '#FFFFFF' }}>
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  {formData.logoUrl ? <img src={formData.logoUrl} alt="Logo Preview" className="h-10 mb-2" /> : <h2 className={`text-2xl font-bold ${strongTextColor}`}>Your Company</h2>}
                  <p className={mutedTextColor}>123 Example St.<br />City, State 12345</p>
                </div>
                <div className="text-right">
                  <h1 className="text-4xl font-bold tracking-wider" style={{ color: formData.accentColor || '#4A9B8E' }}>INVOICE</h1>
                  <p className={`${mutedTextColor} mt-1`}>INV-PREVIEW</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <p className={`text-sm font-semibold ${mutedTextColor}`}>BILL TO</p>
                  <p className={`font-bold ${strongTextColor}`}>Client Name</p>
                  <p className={mutedTextColor}>Contact Person</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${mutedTextColor}`}>Issue Date</p>
                  <p className={textColor}>01/01/2025</p>
                </div>
              </div>
              <div className="w-full text-left mb-10">
                <div style={{ backgroundColor: isDarkBg ? 'rgba(255,255,255,0.05)' : (formData.accentColor || '#4A9B8E') + '1A' }} className="rounded-t-lg flex p-3">
                  <span className="flex-1 text-sm font-semibold" style={{ color: formData.accentColor || '#4A9B8E' }}>Description</span>
                  <span className="w-20 text-sm font-semibold text-right" style={{ color: formData.accentColor || '#4A9B8E' }}>Total</span>
                </div>
                <div className="border-b" style={{ borderColor: isDarkBg ? 'rgba(255,255,255,0.1)' : '#F5F4F1' }}>
                  <div className="flex p-3">
                    <span className={`flex-1 ${textColor}`}>Service or Product 1</span>
                    <span className={`w-20 text-right ${textColor}`}>$1,200.00</span>
                  </div>
                </div>
                <div className="border-b" style={{ borderColor: isDarkBg ? 'rgba(255,255,255,0.1)' : '#F5F4F1' }}>
                  <div className="flex p-3">
                    <span className={`flex-1 ${textColor}`}>Service or Product 2</span>
                    <span className={`w-20 text-right ${textColor}`}>$800.00</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-3">
                  <div className="flex justify-between">
                    <span className={mutedTextColor}>Subtotal</span>
                    <span className={`font-medium ${textColor}`}>$2,000.00</span>
                  </div>
                  <div className={`flex justify-between text-xl font-bold pt-3 border-t`} style={{ borderColor: isDarkBg ? 'rgba(255,255,255,0.1)' : '#E8E6E1' }}>
                    <span className={strongTextColor}>Total Due</span>
                    <span style={{ color: formData.accentColor || '#4A9B8E' }}>$2,000.00</span>
                  </div>
                </div>
              </div>
              {formData.footerText && <div className={`mt-10 pt-6 border-t`} style={{ borderColor: isDarkBg ? 'rgba(255,255,255,0.1)' : '#E8E6E1' }}><p className={`${mutedTextColor} text-sm`}>{formData.footerText}</p></div>}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
