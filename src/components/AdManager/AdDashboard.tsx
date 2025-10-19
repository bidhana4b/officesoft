import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Megaphone, TrendingUp, Landmark, AlertTriangle } from 'lucide-react';
import { AdAccount, Campaign, Client } from '../../types';
import { SummaryCard } from './shared/SummaryCard';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AdDashboardProps {
  campaigns: Campaign[];
  adAccounts: AdAccount[];
  clients: Client[];
}

export const AdDashboard: React.FC<AdDashboardProps> = ({ campaigns, adAccounts, clients }) => {
  const { isDarkMode } = useTheme();

  const dashboardData = useMemo(() => {
    const totalSpend = campaigns
      .filter(c => c.status === 'completed' && c.actualSpendUSD)
      .reduce((sum, c) => sum + c.actualSpendUSD!, 0);

    const totalProfit = campaigns
      .filter(c => c.status === 'completed' && c.profit)
      .reduce((sum, c) => sum + c.profit!, 0);

    const activeCampaigns = campaigns.filter(c => c.status === 'running').length;
    
    const lowBalanceAccounts = adAccounts.filter(acc => acc.balanceUSD < 1000).length;

    const profitByPlatform = campaigns
      .filter(c => c.status === 'completed' && c.profit)
      .reduce((acc, c) => {
        const platformName = c.platformId.charAt(0).toUpperCase() + c.platformId.slice(1);
        acc[platformName] = (acc[platformName] || 0) + c.profit!;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalSpend,
      totalProfit,
      activeCampaigns,
      lowBalanceAccounts,
      profitByPlatform: Object.entries(profitByPlatform).map(([name, value]) => ({ name, value })),
    };
  }, [campaigns, adAccounts]);

  const summaryStats = [
    { label: 'Total Ad Spend (Completed)', value: dashboardData.totalSpend, icon: DollarSign, color: 'text-accent-teal', format: 'currency' },
    { label: 'Total Profit (BDT)', value: dashboardData.totalProfit, icon: TrendingUp, color: 'text-green-500', format: 'bdt' },
    { label: 'Active Campaigns', value: dashboardData.activeCampaigns, icon: Megaphone, color: 'text-blue-500' },
    { label: 'Low Balance Accounts', value: dashboardData.lowBalanceAccounts, icon: dashboardData.lowBalanceAccounts > 0 ? AlertTriangle : Landmark, color: dashboardData.lowBalanceAccounts > 0 ? 'text-red-500' : 'text-accent-orange' },
  ];

  const chartOption = {
    title: {
      text: 'Profit by Platform (BDT)',
      left: 'left',
      textStyle: {
        color: isDarkMode ? '#E5E7EB' : '#1A1A1A',
        fontSize: 20,
        fontWeight: '600',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} BDT ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        color: isDarkMode ? '#9CA3AF' : '#4A4A4A',
      },
    },
    series: [
      {
        name: 'Profit',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          borderWidth: 2,
        },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: '20', fontWeight: 'bold', color: isDarkMode ? '#FFF' : '#1A1A1A' }
        },
        data: dashboardData.profitByPlatform,
      },
    ],
    color: ['#4A9B8E', '#D2691E', '#3B82F6', '#8B5CF6'],
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, index) => (
          <SummaryCard key={index} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600"
        >
          <ReactECharts option={chartOption} style={{ height: '350px', width: '100%' }} />
        </motion.div>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600"
        >
            <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white mb-4">Recent Running Campaigns</h3>
            <div className="space-y-4">
                {campaigns.filter(c => c.status === 'running').slice(0, 4).map(c => {
                    const client = clients.find(cl => cl.id === c.clientId);
                    return (
                        <div key={c.id} className="p-3 rounded-lg bg-sand-50 dark:bg-dark-700">
                            <p className="font-medium text-charcoal-800 dark:text-gray-200 truncate">{c.name}</p>
                            <p className="text-sm text-charcoal-500 dark:text-gray-400">{client?.name || 'Unknown Client'}</p>
                        </div>
                    );
                })}
            </div>
        </motion.div>
      </div>
    </div>
  );
};
