import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent, GridComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';

echarts.use([BarChart, TooltipComponent, LegendComponent, GridComponent, TitleComponent, CanvasRenderer]);

interface IncomeExpenseBarChartProps {
  data: Record<string, { income: number; expense: number }>;
}

export const IncomeExpenseBarChart: React.FC<IncomeExpenseBarChartProps> = ({ data }) => {
  const { isDarkMode } = useTheme();
  
  const months = Object.keys(data);
  const incomeData = months.map(month => data[month].income);
  const expenseData = months.map(month => data[month].expense);

  const option = {
    title: {
      text: 'Income vs Expense',
      left: 'left',
      textStyle: {
        color: isDarkMode ? '#E5E7EB' : '#1A1A1A',
        fontSize: 20,
        fontWeight: '600',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['Income', 'Expense'],
      right: 10,
      textStyle: {
        color: isDarkMode ? '#9CA3AF' : '#4A4A4A',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: months,
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: isDarkMode ? '#3A3A3A' : '#E8E6E1',
          },
        },
        axisLabel: {
          color: isDarkMode ? '#9CA3AF' : '#6A6A6A',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '${value}',
          color: isDarkMode ? '#9CA3AF' : '#6A6A6A',
        },
        splitLine: {
          lineStyle: {
            color: isDarkMode ? '#2A2A2A' : '#F5F4F1',
          },
        },
      },
    ],
    series: [
      {
        name: 'Income',
        type: 'bar',
        barWidth: '30%',
        data: incomeData,
        itemStyle: {
          color: '#4A9B8E',
          borderRadius: [4, 4, 0, 0],
        },
      },
      {
        name: 'Expense',
        type: 'bar',
        barWidth: '30%',
        data: expenseData,
        itemStyle: {
          color: '#D2691E',
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600"
    >
      <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />
    </motion.div>
  );
};
