import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

// Enregistrer les composants nécessaires pour Line chart
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const LineChart = () => {
  // const data = {
  //   labels: ['Jan', 'Feb', 'Mar', 'Apr'],
  //   datasets: [
  //     {
  //       label: 'Ventes',
  //       data: [12, 19, 3, 5],
  //       borderColor: '#3498db',
  //       backgroundColor: 'rgba(52, 152, 219, 0.2)',
  //       tension: 0.3, // courbe lissée
  //       fill: true,    // remplir sous la ligne
  //     },
  //   ],
  // };

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Ventes',
        data: [12, 19, 3, 5, 7.6, 3, 9],
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.4)', // <--- Couleur sous la ligne
        tension: 0.3,
        fill: true, // <--- Remplir sous la courbe
      },
    ],
  };
  

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    // <div style={{ width: '100%', height: '400px' }}>
      <Line data={data} options={options} />
    // </div>
  );
};

export default LineChart;
