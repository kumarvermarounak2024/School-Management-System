// components/StudentStrengthPieChart.jsx
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const allClasses = [
  "1st", "2nd", "3rd", "4th", "5th", "6th",
  "7th", "8th", "9th", "10th", "11th", "12th",
];

const classColors = [
  "#4F81BD", "#9BBB59", "#F79646", "#8064A2", "#FFD966",
  "#4BACC6", "#C0504D", "#C0C0C0", "#00B0F0", "#F2DCDB",
  "#95B3D7", "#1F497D"
];

const StudentStrengthPieChart = () => {
  const [chartData, setChartData] = useState(null);
  const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admissions/getAllAdmissions`);
      if (response?.status === 200) {
        const studentsData = response?.data?.data || [];

        // Initialize class-wise count
        const classWiseCount = {};
        allClasses?.forEach(className => {
          classWiseCount[className] = 0;
        });

        // Count students per class
        studentsData?.forEach(student => {
          const className = student?.level_class?.Name;
          if (classWiseCount?.hasOwnProperty(className)) {
            classWiseCount[className]++;
          }
        });

        // Prepare chart data
        setChartData({
          labels: allClasses,
          datasets: [
            {
              data: allClasses?.map(className => classWiseCount[className]),
              backgroundColor: classColors,
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return chartData ? (
    <Pie data={chartData} options={options} />
  ) : (
    <p>Loading student strength data...</p>
  );
};

export default StudentStrengthPieChart;
