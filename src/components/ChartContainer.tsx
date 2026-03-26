import { useEffect, useState } from 'react';
import { getStats } from '../services/serviceEmploye';
import { Pie } from 'react-chartjs-2';
import { IonButton } from '@ionic/react';
import './ChartContainer.css';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartContainer: React.FC = () => {
  const [stats, setStats] = useState({
    salaire_total: 0,
    salaire_min: 0,
    salaire_max: 0
  });

  const fetchStats = async () => {
    const response = await getStats();
    setStats(response);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const pieData = {
    labels: ["Total Salaire", "Salaire Min", "Salaire Max"],
    datasets: [
      {
        data: [stats.salaire_total, stats.salaire_min, stats.salaire_max],
        backgroundColor: ["#4cd964", "#ff9500", "#ff3b30"],
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "40%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          font: { size: 14 },
          color: "#333"
        }
      },
      tooltip: {
        backgroundColor: "#000",
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: function (context: TooltipItem<"pie">) {
            return `${context.label} : ${context.raw} Ar`;
          }
        }
      }
    }
  };

  return (
    <div className="body">
      <div className="chart-container">
        <Pie data={pieData} options={options} />
      </div>

      <p className="chart-description">
        Ce graphique montre la répartition des salaires : total cumulé, minimum et maximum.
        Les valeurs sont mises à jour automatiquement depuis la base de données.
      </p>

      <IonButton onClick={fetchStats} className="btn">
        Rafraîchir les données
      </IonButton>
    </div>
  );
};

export default ChartContainer;