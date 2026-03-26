import { useEffect, useState } from 'react';
import { getStats } from '../services/serviceEmploye';
import { Pie } from 'react-chartjs-2';
import { IonButton, IonIcon } from '@ionic/react';
import './ChartContainer.css';
import { refreshOutline } from 'ionicons/icons';

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
        backgroundColor: ["#404040", "#808080", "#b3b3b3"],
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
        backgroundColor: "white",
        titleColor: "black",
        bodyColor: "black",
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
        <IonIcon slot="start" icon={refreshOutline}/>
        Rafraîchir les données
      </IonButton>
    </div>
  );
};

export default ChartContainer;