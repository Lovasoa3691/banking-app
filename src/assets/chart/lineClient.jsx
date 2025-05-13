import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../../components/api/api";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const LineChartClient = ({ numCompte }) => {
  const [operationData, setOperationData] = useState({
    totalRetrait: 0,
    totalVirement: 0,
    totalPret: 0,
  });

  const getTotalOperations = () => {
    api
      .get(`/operations/client/operations/${numCompte}`)
      .then((rep) => {
        // console.log(rep.data);
        setOperationData({
          totalRetrait: rep.data.totalRetrait,
          totalVirement: rep.data.totalVirement,
          totalPret: rep.data.totalPret,
        });
      })
      .catch((err) => {
        console.log("Erreur lors de la récupération des opérations: ", err);
      });
  };

  useEffect(() => {
    getTotalOperations();
  }, []);
  const data = {
    labels: ["Retrait", "Virement", "Demande de pret"],
    datasets: [
      {
        label: "Statistiques des operations",
        data: [
          operationData.totalRetrait,
          operationData.totalVirement,
          operationData.totalPret,
        ],
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.4)",
        tension: 0.3,
        fill: true,
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

export default LineChartClient;
