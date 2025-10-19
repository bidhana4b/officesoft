import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Megaphone, Users, Landmark, BarChart4 } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { AdAccount, Campaign, Client, ClientAdTransaction, TeamMember } from '../../types';
import { mockAdAccounts, mockCampaigns, mockClients, mockClientAdTransactions, mockTeamMembers } from '../../data/mockData';

import { AdDashboard } from './AdDashboard';
import { AdCampaignsView } from './AdCampaignsView';
import { AdAccountsView } from './AdAccountsView';
import { AdClientsView } from './AdClientsView';
import { AdReportsView } from './AdReportsView';
import { AdRequestModal } from './modals/AdRequestModal';
import { CompleteCampaignModal } from './modals/CompleteCampaignModal';
import { AddDepositModal } from './modals/AddDepositModal';
import { RechargeAccountModal } from './modals/RechargeAccountModal';


type AdManagerViewType = 'dashboard' | 'campaigns' | 'clients' | 'accounts' | 'reports';

const subNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'accounts', label: 'Ad Accounts', icon: Landmark },
  { id: 'reports', label: 'Profit Reports', icon: BarChart4 },
];

export const AdManagerView: React.FC = () => {
  const [activeView, setActiveView] = useState<AdManagerViewType>('dashboard');
  
  // State management for the entire module
  const [campaigns, setCampaigns] = useLocalStorage<Campaign[]>('ad_campaigns', mockCampaigns);
  const [adAccounts, setAdAccounts] = useLocalStorage<AdAccount[]>('ad_accounts', mockAdAccounts);
  const [clients, setClients] = useLocalStorage<Client[]>('ad_clients', mockClients);
  const [transactions, setTransactions] = useLocalStorage<ClientAdTransaction[]>('ad_transactions', mockClientAdTransactions);
  const [teamMembers] = useLocalStorage<TeamMember[]>('teamMembers', mockTeamMembers);

  const currentUser = teamMembers.find(m => m.id === '1')!; // Assuming Admin for full access

  // Modal states
  const [isAdRequestModalOpen, setAdRequestModalOpen] = useState(false);
  const [isCompleteModalOpen, setCompleteModalOpen] = useState(false);
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const [isRechargeModalOpen, setRechargeModalOpen] = useState(false);
  
  // Data for modals
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedAdAccount, setSelectedAdAccount] = useState<AdAccount | null>(null);

  // Handlers
  const handleOpenAdRequestModal = (campaign: Campaign | null = null) => {
    setEditingCampaign(campaign);
    setAdRequestModalOpen(true);
  };
  
  const handleOpenCompleteModal = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setCompleteModalOpen(true);
  };

  const handleOpenDepositModal = (client: Client) => {
    setSelectedClient(client);
    setDepositModalOpen(true);
  };
  
  const handleOpenRechargeModal = (account: AdAccount) => {
    setSelectedAdAccount(account);
    setRechargeModalOpen(true);
  };

  const handleSaveCampaign = (campaign: Campaign) => {
    setCampaigns(prev => {
        const exists = prev.some(c => c.id === campaign.id);
        if (exists) {
            return prev.map(c => c.id === campaign.id ? campaign : c);
        }
        return [campaign, ...prev];
    });
    setAdRequestModalOpen(false);
    setEditingCampaign(null);
  };

  const handleCompleteCampaign = (campaign: Campaign, spend: number, adAccountId: string) => {
    const client = clients.find(c => c.id === campaign.clientId);
    const adAccount = adAccounts.find(acc => acc.id === adAccountId);

    if (!client || !adAccount) {
      alert("Error: Client or Ad Account not found!");
      return;
    }

    const clientRate = client.avgDepositRate || 0;
    const agencyRate = adAccount.avgCostPerUSD || 0;
    const profit = (spend * clientRate) - (spend * agencyRate);

    // Update campaign
    const updatedCampaign: Campaign = {
      ...campaign,
      status: 'completed',
      actualSpendUSD: spend,
      adAccountId,
      completedAt: new Date().toISOString(),
      profit,
    };
    setCampaigns(prev => prev.map(c => c.id === campaign.id ? updatedCampaign : c));

    // Update client balance
    setClients(prev => prev.map(c => c.id === client.id ? {...c, adBalanceUSD: (c.adBalanceUSD || 0) - spend} : c));
    
    // Update ad account balance
    setAdAccounts(prev => prev.map(acc => acc.id === adAccountId ? {...acc, balanceUSD: acc.balanceUSD - spend} : acc));

    // Add spend transaction for client
    const spendTransaction: ClientAdTransaction = {
      id: crypto.randomUUID(),
      clientId: client.id,
      type: 'spend',
      amountUSD: spend,
      transactionDate: new Date().toISOString(),
      campaignId: campaign.id,
    };
    setTransactions(prev => [...prev, spendTransaction]);
    
    setCompleteModalOpen(false);
    setEditingCampaign(null);
  };

  const handleAddDeposit = (client: Client, amountUSD: number, amountBDT: number, rate: number) => {
      setClients(prev => prev.map(c => {
          if (c.id === client.id) {
              const newBalance = (c.adBalanceUSD || 0) + amountUSD;
              // In a real app, avgDepositRate would be a weighted average. Here we just update it.
              return {...c, adBalanceUSD: newBalance, avgDepositRate: rate };
          }
          return c;
      }));

      const depositTransaction: ClientAdTransaction = {
        id: crypto.randomUUID(),
        clientId: client.id,
        type: 'deposit',
        amountBDT,
        amountUSD,
        ratePerUSD: rate,
        transactionDate: new Date().toISOString(),
      };
      setTransactions(prev => [depositTransaction, ...prev]);

      setDepositModalOpen(false);
      setSelectedClient(null);
  };

  const handleRechargeAccount = (account: AdAccount, amountUSD: number, costBDT: number, rate: number) => {
      setAdAccounts(prev => prev.map(acc => {
          if (acc.id === account.id) {
              const newBalance = acc.balanceUSD + amountUSD;
              // Again, simplifying avg cost calculation
              return {...acc, balanceUSD: newBalance, avgCostPerUSD: rate};
          }
          return acc;
      }));
      setRechargeModalOpen(false);
      setSelectedAdAccount(null);
  };


  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <AdDashboard campaigns={campaigns} adAccounts={adAccounts} clients={clients} />;
      case 'campaigns':
        return <AdCampaignsView campaigns={campaigns} clients={clients} teamMembers={teamMembers} onNewRequest={handleOpenAdRequestModal} onComplete={handleOpenCompleteModal} />;
      case 'clients':
        return <AdClientsView clients={clients} onAddDeposit={handleOpenDepositModal} />;
      case 'accounts':
        return <AdAccountsView adAccounts={adAccounts} onRecharge={handleOpenRechargeModal} />;
      case 'reports':
        return <AdReportsView campaigns={campaigns} clients={clients} adAccounts={adAccounts} />;
      default:
        return <AdDashboard campaigns={campaigns} adAccounts={adAccounts} clients={clients} />;
    }
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-header font-semibold text-charcoal-900 dark:text-white mb-2">Ad Management</h1>
          <p className="text-charcoal-600 dark:text-gray-400">Centralized control for all your ad campaigns and finances.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-2 border border-transparent dark:border-dark-600 flex items-center space-x-2">
        {subNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as AdManagerViewType)}
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
      
      <AdRequestModal 
        isOpen={isAdRequestModalOpen}
        onClose={() => setAdRequestModalOpen(false)}
        onSave={handleSaveCampaign}
        campaign={editingCampaign}
        clients={clients}
        teamMembers={teamMembers}
        currentUser={currentUser}
      />
      <CompleteCampaignModal
        isOpen={isCompleteModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        onComplete={handleCompleteCampaign}
        campaign={editingCampaign}
        adAccounts={adAccounts}
      />
      <AddDepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSave={handleAddDeposit}
        client={selectedClient}
      />
      <RechargeAccountModal
        isOpen={isRechargeModalOpen}
        onClose={() => setRechargeModalOpen(false)}
        onSave={handleRechargeAccount}
        adAccount={selectedAdAccount}
      />
    </div>
  );
};
