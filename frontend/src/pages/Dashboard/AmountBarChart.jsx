// components/AmountBarChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // 👈 import plugin

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels); // 👈 register plugin

const barChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Amount',
      data: [1500, 1000, 8001, 2000, 3500, 4500, 2900, 3500, 3600, 1000, 800, 1700],
      backgroundColor: '#4285F4',
    },
  ],
};

const optionsAmount = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Amount',
      font: {
        size: 20,
        weight: 'bold',
      },
    },
    datalabels: {
      anchor: 'end',
      align: 'end',
      color: '#000',
      font: {
        size: 10,
        weight: 'bold',
      },
      formatter: Math.round,
    },
  },
  scales: {
    x: {
      ticks: {
        autoSkip: false,
        maxRotation: 45,
        minRotation: 45,
        font: {
          size: 10,
        },
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: 12,
        },
      },
    },
  },
};

const AmountBarChart = () => (
  <div style={{ height: '300px' }}>
    <Bar data={barChartData} options={optionsAmount} />
  </div>
);

export default AmountBarChart;
