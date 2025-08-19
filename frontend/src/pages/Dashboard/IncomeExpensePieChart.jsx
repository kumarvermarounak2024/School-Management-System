// components/IncomeExpensePieChart.jsx
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

// const data = {
//   datasets: [
//     {
//       data: [50, { totalFinalSalary }], // Income and Expenses
//       backgroundColor: ["#36A2EB", "#FF6384"],
//     },
//   ],
//   labels: ["Income", "Expenses"],
// };

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom", // Can be 'top', 'right', 'left'
      labels: {
        boxWidth: 10,
        font: {
          size: 12,
        },
      },
    },
  },
};

const IncomeExpensePieChart = () => {
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;
  const [totalFinalSalary, setTotalFinalSalary] = useState(0);

  const data = {
    datasets: [
      {
        data: [50, totalFinalSalary], // Income and Expenses
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
    labels: ["Income", "Expenses"],
  };
  useEffect(() => {
    const fetchIncomeExpense = async () => {
      const response = await axios.get(
        `${apiUrl}/salaryassign/getAllAssign`
      );
      const data = response?.data?.data || [];
      const currentYear = new Date().getFullYear();
      // Filter for current year
      const currentYearSalaries = data.filter(item => {
        const assignedYear = new Date(item.assignedAt).getFullYear();
        return assignedYear === currentYear;
      });
      // Sum all finalSalary values for current year
      const total = currentYearSalaries.reduce((sum, item) => {
        const salary = item?.gradeId?.finalSalary || 0;
        return sum + salary;
      }, 0);
      setTotalFinalSalary(total);
      console.log('Total Final Salary for current year:', total);
    }
    fetchIncomeExpense();
  }, [])
  return (
    <div>
      <Pie data={data} options={options} />
    </div>
  )
};

export default IncomeExpensePieChart;
