import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Transaction } from '../../../types';
import { SummaryCard } from './SummaryCard';
import { IncomeExpenseBarChart } from '../charts/IncomeExpenseBarChart';
import { CategoryDonutChart } from '../charts/CategoryDonutChart';
import { RecentTransactions } from './RecentTransactions';

interface DashboardViewProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ transactions, onAddTransaction }) => {
    
  const financialData = useMemo(() => {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const prev30DaysStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const currentPeriodTransactions = transactions.filter(t => new Date(t.date) >= last30Days);
    const previousPeriodTransactions = transactions.filter(t => new Date(t.date) >= prev30DaysStart && new Date(t.date) < last30Days);

    const calculateMetrics = (trans: Transaction[]) => {
        const income = trans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = trans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return { income, expense, profit: income - expense };
    };

    const currentMetrics = calculateMetrics(currentPeriodTransactions);
    const previousMetrics = calculateMetrics(previousPeriodTransactions);

    const calculatePercentageChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };
    
    const allTimeIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const allTimeExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const incomeByCategory = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const monthlyData = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0 };
      }
      acc[month][t.type] += t.amount;
      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    return {
      income: { value: currentMetrics.income, change: calculatePercentageChange(currentMetrics.income, previousMetrics.income) },
      expense: { value: currentMetrics.expense, change: calculatePercentageChange(currentMetrics.expense, previousMetrics.expense) },
      profit: { value: currentMetrics.profit, change: calculatePercentageChange(currentMetrics.profit, previousMetrics.profit) },
      incomeByCategory: Object.entries(incomeByCategory).map(([name, value]) => ({ name, value })),
      expensesByCategory: Object.entries(expensesByCategory).map(([name, value]) => ({ name, value })),
      monthlyData,
      recentTransactions: [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
    };
  }, [transactions]);

  const summaryStats = [
    { label: 'Total Income', value: financialData.income.value, change: financialData.income.change, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Total Expenses', value: financialData.expense.value, change: financialData.expense.change, icon: TrendingDown, color: 'text-red-500', invertChange: true },
    { label: 'Net Profit', value: financialData.profit.value, change: financialData.profit.change, icon: DollarSign, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
            <h2 className="text-section font-semibold text-charcoal-900 dark:text-white">Dashboard</h2>
            <motion.button
            onClick={onAddTransaction}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-3 rounded-xl font-medium hover:shadow-hover dark:hover:shadow-dark-hover transition-all shadow-soft dark:shadow-dark-soft flex items-center space-x-2"
            >
            <Plus size={20} />
            <span>Add Transaction</span>
            </motion.button>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryStats.map((stat, index) => (
          <SummaryCard key={index} {...stat} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <RecentTransactions transactions={financialData.recentTransactions} />
        </div>
        <div className="space-y-8">
            <CategoryDonutChart title="Income by Sector" data={financialData.incomeByCategory} />
            <CategoryDonutChart title="Expenses by Category" data={financialData.expensesByCategory} />
        </div>
      </div>

      <IncomeExpenseBarChart data={financialData.monthlyData} />
    </div>
  );
};
