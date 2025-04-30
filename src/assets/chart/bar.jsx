import React from 'react'
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
  } from 'chart.js';
  
  // Enregistrement des composants nécessaires
  ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
  
  const BarChart = () => {
    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      datasets: [
        {
          label: 'Ventes',
          data: [12, 19, 3, 5],
          backgroundColor: '#3498db',
        },
      ],
    };
  
    const options = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  
    return <Bar data={data} options={options}/>;
  };
 
export default BarChart;