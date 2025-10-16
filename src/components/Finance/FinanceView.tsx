import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, List, Wallet, BarChart4 } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Transaction, Fund } from '../../types';
import { mockTransactions, mockFunds } from '../../data/mockData';

import { DashboardView } from './v2/DashboardView';
import { TransactionsView } from './v2/TransactionsView';
import { FundsView } from './v2/FundsView';
import { ReportsView } from './v2/ReportsView';
import { TransactionModal } from './v2/TransactionModal';
import { TransferFundsModal } from './v2/TransferFundsModal';

type FinanceViewType = 'dashboard' | 'transactions' | 'funds' | 'reports';

const subNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: List },
  { id: 'funds', label: 'Funds', icon: Wallet },
  { id: 'reports', label: 'Reports', icon: BarChart4 },
];

export const FinanceView: React.FC = () => {
  const [activeView, setActiveView] = useState<FinanceViewType>('dashboard');
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactionsV2', mockTransactions);
  const [funds, setFunds] = useLocalStorage<Fund[]>('fundsV2', mockFunds);

  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);

  const handleOpenTransactionModal = (transaction: Transaction | null = null) => {
    setEditingTransaction(transaction);
    setTransactionModalOpen(true);
  };

  const handleSaveTransaction = (transaction: Transaction) => {
    setTransactions(prev => {
      const exists = prev.some(t => t.id === transaction.id);
      if (exists) {
        return prev.map(t => t.id === transaction.id ? transaction : t);
      }
      return [transaction, ...prev];
    });

    // Update fund balances
    const amountChange = transaction.amount;
    const fundId = transaction.fundId;
    if (fundId) {
        setFunds(prevFunds => prevFunds.map(fund => {
            if (fund.id === fundId) {
                const newBalance = fund.balance + (transaction.type === 'income' ? amountChange : -amountChange);
                return { ...fund, balance: newBalance };
            }
            return fund;
        }));
    }

    setTransactionModalOpen(false);
  };
  
  const handleDeleteTransactions = (transactionIds: string[]) => {
    const toDelete = transactions.filter(t => transactionIds.includes(t.id));
    
    setTransactions(prev => prev.filter(t => !transactionIds.includes(t.id)));

    // Adjust fund balances
    const fundAdjustments = new Map<string, number>();
    toDelete.forEach(t => {
        if (t.fundId) {
            const currentAdjustment = fundAdjustments.get(t.fundId) || 0;
            const change = t.type === 'income' ? -t.amount : t.amount;
            fundAdjustments.set(t.fundId, currentAdjustment + change);
        }
    });

    setFunds(prevFunds => prevFunds.map(fund => {
        if (fundAdjustments.has(fund.id)) {
            return { ...fund, balance: fund.balance + (fundAdjustments.get(fund.id) || 0) };
        }
        return fund;
    }));
  };

  const handleTransferFunds = (fromFundId: string, toFundId: string, amount: number) => {
    setFunds(prevFunds => prevFunds.map(fund => {
        if (fund.id === fromFundId) return { ...fund, balance: fund.balance - amount };
        if (fund.id === toFundId) return { ...fund, balance: fund.balance + amount };
        return fund;
    }));
    // Optional: Create two transactions to log the transfer
    const transferOut: Transaction = {
        id: crypto.randomUUID(),
        type: 'expense',
        description: `Transfer to ${funds.find(f => f.id === toFundId)?.name}`,
        amount,
        category: 'Transfers',
        date: new Date().toISOString(),
        fundId: fromFundId
    };
    const transferIn: Transaction = {
        id: crypto.randomUUID(),
        type: 'income',
        description: `Transfer from ${funds.find(f => f.id === fromFundId)?.name}`,
        amount,
        category: 'Transfers',
        date: new Date().toISOString(),
        fundId: toFundId
    };
    setTransactions(prev => [transferIn, transferOut, ...prev]);
    setTransferModalOpen(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView transactions={transactions} onAddTransaction={handleOpenTransactionModal} />;
      case 'transactions':
        return <TransactionsView transactions={transactions} funds={funds} onAddTransaction={handleOpenTransactionModal} onEditTransaction={handleOpenTransactionModal} onDeleteTransactions={handleDeleteTransactions} />;
      case 'funds':
        return <FundsView funds={funds} onTransfer={() => setTransferModalOpen(true)} />;
      case 'reports':
        return <ReportsView transactions={transactions} />;
      default:
        return <DashboardView transactions={transactions} onAddTransaction={handleOpenTransactionModal} />;
    }
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-header font-semibold text-charcoal-900 dark:text-white mb-2">Finance</h1>
          <p className="text-charcoal-600 dark:text-gray-400">Your agency's financial command center.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-2 border border-transparent dark:border-dark-600 flex items-center space-x-2">
        {subNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as FinanceViewType)}
              className={`flex-1 flex items-center justify-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive ? 'bg-sand-100 dark:bg-dark-700 text-accent-teal shadow-sm' : 'text-charcoal-600 dark:text-gray-400 hover:bg-sand-50 dark:hover:bg-dark-700/50'}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        onSave={handleSaveTransaction}
        transaction={editingTransaction}
        funds={funds}
      />
      
      <TransferFundsModal
        isOpen={isTransferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        onTransfer={handleTransferFunds}
        funds={funds}
      />
    </div>
  );
};
