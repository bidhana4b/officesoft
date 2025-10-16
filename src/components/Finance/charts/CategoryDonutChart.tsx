import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';

echarts.use([PieChart, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer]);

interface CategoryDonutChartProps {
  title: string;
  data: { name: string; value: number }[];
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ title, data }) => {
  const { isDarkMode } = useTheme();

  const isIncome = title.toLowerCase().includes('income');
  const colors = isIncome 
    ? ['#4A9B8E', '#63B4A5', '#7BCDBB', '#94E6D2', '#AEFFEA'] 
    : ['#D2691E', '#E58440', '#F09E6A', '#F9B894', '#FFD2BE'];

  const option = {
    color: colors,
    title: {
      text: title,
      left: 'left',
      textStyle: {
        color: isDarkMode ? '#E5E7EB' : '#1A1A1A',
        fontSize: 20,
        fontWeight: '600',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: ${c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      itemGap: 15,
      textStyle: {
        color: isDarkMode ? '#9CA3AF' : '#4A4A4A',
      },
      icon: 'circle',
    },
    series: [
      {
        name: title,
        type: 'pie',
        radius: ['50%', '75%'],
        center: ['30%', '55%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold',
            formatter: '{b}\n${c}',
            position: 'center',
            color: isDarkMode ? '#FFF' : '#1A1A1A',
          },
        },
        labelLine: {
          show: false,
        },
        data: data,
      },
    ],
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600"
    >
      <ReactECharts option={option} style={{ height: '250px', width: '100%' }} />
    </motion.div>
  );
};
