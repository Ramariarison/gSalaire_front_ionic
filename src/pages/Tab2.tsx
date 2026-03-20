import { 
  IonPage, 
  IonToolbar, 
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonIcon,
  IonHeader
} from "@ionic/react";

import { useEffect, useState } from "react";
import { Employe } from "../types/Employe";
import { getEmployes } from "../services/serviceEmploye";
import { create, trash } from "ionicons/icons";
import './Tab2.css';

const Tab2: React.FC = () => {

  const [employes, setEmployes] = useState<Employe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  {/* Charger les employés */}
  const fecthEmployes = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getEmployes();
      setEmployes(data);
    } catch (error) {
      console.error('Erreur lors du chargement des employés :', error);
      setError("Impossible de charger les données. Vérifiez votre connexion internet.")
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fecthEmployes();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Liste des employés
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>

        {loading && (
          <p className="status-text">Veuillez patienter...</p>
        )}

        {error && (
          <p style={{ textAlign: 'center', color: 'red' }}>
            {error}
          </p>
        )}

        {!loading && employes.length === 0 && !error && (
          <p style={{ textAlign: 'center' }}>
            Aucun employé trouvé
          </p>
        )}
        
        {/* Liste des employés */}
        {!loading && !error && (
          <IonList>
            {employes.map((emp) => (
              <IonItem key={emp.id} className="employe-item">
                <div className="employe-card">

                  <div className="employe-info">
                    <h2>{emp.nom}</h2>
                    <p>Salaire: {emp.salaire} Ar</p>
                  </div>

                  <div className="employe-actions">
                    <IonButton fill="clear">
                      <IonIcon icon={create}></IonIcon>
                    </IonButton>

                    <IonButton color="danger" fill="clear">
                      <IonIcon icon={trash}></IonIcon>
                    </IonButton>
                  </div>

                </div>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;