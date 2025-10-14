import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { mockIncomeTransactions, mockExpenseTransactions } from '../../data/mockData';
import { IncomeTransaction, ExpenseTransaction } from '../../types';
import { TransactionTable } from './TransactionTable';
import { TransactionModal } from './TransactionModal';

export const FinanceView: React.FC = () => {
  const [income, setIncome] = useState<IncomeTransaction[]>(mockIncomeTransactions);
  const [expenses, setExpenses] = useState<ExpenseTransaction[]>(mockExpenseTransactions);
  const [modalType, setModalType] = useState<'income' | 'expense' | null>(null);

  const { totalIncome, totalExpenses, netBalance } = useMemo(() => {
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    return { totalIncome, totalExpenses, netBalance };
  }, [income, expenses]);

  const handleSaveTransactions = (transactions: any[], type: 'income' | 'expense') => {
    if (type === 'income') {
      setIncome(prev => [...prev, ...transactions]);
    } else {
      setExpenses(prev => [...prev, ...transactions]);
    }
    setModalType(null);
  };

  const summaryStats = [
    { label: 'Total Income', value: totalIncome, icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { label: 'Total Expenses', value: totalExpenses, icon: TrendingDown, color: 'from-red-500 to-red-600' },
    { label: 'Net Balance', value: netBalance, icon: DollarSign, color: netBalance >= 0 ? 'from-accent-teal to-accent-teal-dark' : 'from-red-500 to-red-600' },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-header font-semibold text-charcoal-900 dark:text-white mb-2">Finance Overview</h1>
        <p className="text-charcoal-600 dark:text-gray-400">Track your income, expenses, and profitability.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-soft dark:shadow-dark-soft border border-transparent dark:border-dark-600"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-charcoal-500 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-charcoal-900 dark:text-white mt-1">
                    {stat.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-soft`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TransactionTable 
          title="Income" 
          transactions={income} 
          type="income" 
          onAdd={() => setModalType('income')} 
        />
        <TransactionTable 
          title="Expenses" 
          transactions={expenses} 
          type="expense" 
          onAdd={() => setModalType('expense')} 
        />
      </div>

      <TransactionModal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        onSave={handleSaveTransactions}
        type={modalType}
      />
    </div>
  );
};
