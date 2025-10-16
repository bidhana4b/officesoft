import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Transaction } from '../../../types';

type ReportType = 'pnl' | 'income' | 'expense';
type DateRange = 'all' | '30d' | '90d';

interface ReportsViewProps {
  transactions: Transaction[];
}

const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

export const ReportsView: React.FC<ReportsViewProps> = ({ transactions }) => {
  const [reportType, setReportType] = useState<ReportType>('pnl');
  const [dateRange, setDateRange] = useState<DateRange>('all');

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    if (dateRange === 'all') return transactions;
    const days = dateRange === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return transactions.filter(t => new Date(t.date) >= startDate);
  }, [transactions, dateRange]);

  const reportData = useMemo(() => {
    const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    if (reportType === 'pnl') {
      return [
        { item: 'Total Income', amount: totalIncome },
        { item: 'Total Expenses', amount: totalExpense },
        { item: 'Net Profit', amount: totalIncome - totalExpense },
      ];
    }

    const typeToAnalyze = reportType === 'income' ? 'income' : 'expense';
    const breakdown = filteredTransactions
      .filter(t => t.type === typeToAnalyze)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(breakdown)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions, reportType]);
  
  const handleExport = () => {
    exportToCSV(reportData, `${reportType}_report_${dateRange}_${new Date().toISOString().split('T')[0]}`);
  };

  const getReportTitle = () => {
      if (reportType === 'pnl') return 'Profit & Loss Statement';
      if (reportType === 'income') return 'Income by Sector';
      return 'Expenses by Category';
  }

  return (
    <div className="space-y-6 bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">Financial Reports</h2>
          <p className="text-charcoal-600 dark:text-gray-400 text-sm">Generate and analyze financial statements.</p>
        </div>
        <motion.button
            onClick={handleExport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-sand-100 dark:bg-dark-700 text-charcoal-700 dark:text-gray-300 px-4 py-2 rounded-xl font-medium flex items-center space-x-2"
        >
          <Download size={16} />
          <span>Export CSV</span>
        </motion.button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 p-1 bg-sand-100 dark:bg-dark-700 rounded-lg">
          {(['pnl', 'income', 'expense'] as const).map(type => (
            <button key={type} onClick={() => setReportType(type)} className={`px-3 py-1 rounded-md text-sm font-medium capitalize transition-colors ${reportType === type ? 'bg-white dark:bg-dark-800 shadow-sm text-accent-teal' : 'text-charcoal-600 dark:text-gray-400'}`}>
              {type === 'pnl' ? 'P&L' : type}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2 p-1 bg-sand-100 dark:bg-dark-700 rounded-lg">
          {(['all', '30d', '90d'] as const).map(range => (
            <button key={range} onClick={() => setDateRange(range)} className={`px-3 py-1 rounded-md text-sm font-medium capitalize transition-colors ${dateRange === range ? 'bg-white dark:bg-dark-800 shadow-sm text-accent-teal' : 'text-charcoal-600 dark:text-gray-400'}`}>
              {range === 'all' ? 'All Time' : `Last ${range.replace('d', '')} Days`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto -mx-6">
        <h3 className="text-lg font-semibold text-charcoal-800 dark:text-gray-200 px-6 mb-4">{getReportTitle()}</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-sand-200 dark:border-dark-600">
              <th className="p-3 pl-6 text-sm font-medium text-charcoal-500 dark:text-gray-400">{reportType === 'pnl' ? 'Item' : 'Category'}</th>
              <th className="p-3 pr-6 text-sm font-medium text-charcoal-500 dark:text-gray-400 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row: any, index) => (
              <tr key={index} className="border-b border-sand-100 dark:border-dark-700 last:border-b-0">
                <td className="p-3 pl-6 text-sm text-charcoal-800 dark:text-gray-200 font-medium">{row.item || row.category}</td>
                <td className={`p-3 pr-6 text-sm font-semibold text-right ${row.item === 'Net Profit' ? (row.amount >= 0 ? 'text-green-600' : 'text-red-600') : 'text-charcoal-800 dark:text-gray-200'}`}>
                  {row.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
