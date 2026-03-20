import { 
  IonPage, 
  IonToolbar, 
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel
} from "@ionic/react";

import { useEffect, useState } from "react";
import { Employe } from "../types/Employe";
import { getEmployes } from "../services/serviceEmploye";

const Tab2: React.FC = () => {

  const [employe, setEmploye] = useState<Employe[]>([]);

  {/* Charger les employés */}
  const fecthEmployes = async () => {
    try {
      const data = await getEmployes();
      setEmploye(data);
    } catch (error) {
      console.error('Erreur lors du chargement des employés :', error);
    }
  }

  useEffect(() => {
    fecthEmployes();
  }, []);

  return (
    <IonPage>
      <IonToolbar>
        <IonTitle>
          Employés
        </IonTitle>
      </IonToolbar>

      <IonContent>
        
        {/* Liste des employés */}
        <IonList>
          {employe.map((emp) => (
            <IonItem key={emp.id}>
              <IonLabel>
                <h2>{emp.nom}</h2>
                <p>{emp.salaire}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;