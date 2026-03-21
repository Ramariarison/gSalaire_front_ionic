import { 
  IonPage, 
  IonToolbar, 
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonIcon,
  IonHeader,
  IonFab,
  IonFabButton,
  IonModal,
  IonInput
} from "@ionic/react";

import { useEffect, useState } from "react";
import { Employe } from "../types/Employe";
import { createEmploye, deleteEmploye, getEmployes, updateEmploye } from "../services/serviceEmploye";
import { add, create, trash } from "ionicons/icons";
import './Tab2.css';

const Tab2: React.FC = () => {

  const [employes, setEmployes] = useState<Employe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentEmploye, setCurrentEmploye] = useState<Employe>({
    nom: '',
    salaire: 0
  });

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

  const handleSave = async () => {
    if (currentEmploye.id) {
      await updateEmploye(currentEmploye);
    } else {
      await createEmploye(currentEmploye);
    }

    setShowModal(false);
    fecthEmployes();
  }

  const handleEdit = (employe: Employe) => {
    setCurrentEmploye(employe);
    setShowModal(true);
  }

  const handleDelete = async (id: number) => {
    await deleteEmploye(id);
    fecthEmployes();
  }

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
                    <IonButton fill="clear" onClick={() => handleEdit(emp)}>
                      <IonIcon icon={create}></IonIcon>
                    </IonButton>

                    <IonButton 
                      color="danger" 
                      fill="clear" 
                      onClick={() => {
                        if(emp.id !== undefined) {
                          handleDelete(emp.id);
                        }
                      }}>
                      <IonIcon icon={trash}></IonIcon>
                    </IonButton>
                  </div>

                </div>
              </IonItem>
            ))}
          </IonList>
        )}

        {/* Bouton ajouter */}
        <IonFab className="fab" vertical="bottom" horizontal="end">
          <IonFabButton className="fab-button"
            onClick={() => {
              setCurrentEmploye({ nom: '', salaire: 0 });
              setShowModal(true);
            }}
          >
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>

        {/* Modal */}
        <IonModal isOpen={showModal}>
          <IonContent>
            <h2>{currentEmploye.id ? 'Modifier' : 'Ajouter'} un employé</h2>

            <IonInput
              placeholder="Nom"
              value={currentEmploye.nom}
              onIonChange={(e) => {
                setCurrentEmploye({
                  ...currentEmploye,
                  nom: e.detail.value!
                })
              }}
            />

            <IonInput
              type="number"
              placeholder="Salaire"
              value={currentEmploye.salaire}
              onIonChange={(e) => {
                setCurrentEmploye({
                  ...currentEmploye,
                  salaire: Number(e.detail.value!)
                })
              }}
            />

            <IonButton expand="block" onClick={handleSave}>
              Enregistrer
            </IonButton>

            <IonButton
              expand="block"
              color="medium"
              onClick={() => setShowModal(false)}
            >
              Annuler
            </IonButton>

          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default Tab2;