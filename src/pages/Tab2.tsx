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
  IonInput,
  IonToast
} from "@ionic/react";

import { useEffect, useState } from "react";
import { Employe } from "../types/Employe";
import { createEmploye, deleteEmploye, getEmployes, updateEmploye } from "../services/serviceEmploye";
import { add, checkmark, close, create, trash } from "ionicons/icons";
import './Tab2.css';

const Tab2: React.FC = () => {

  const [employes, setEmployes] = useState<Employe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [toast, showToast] = useState(false);
  const [currentEmploye, setCurrentEmploye] = useState<Employe>({
    id: undefined,
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
      showToast(true);
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
    let response;

    if (currentEmploye.id !== undefined) {
      response = await updateEmploye(currentEmploye);
    } else {
      response = await createEmploye(currentEmploye);
    }

    setMessage(response.message);
    setShowModal(false);
    fecthEmployes();
  }

  const handleEdit = (employe: Employe) => {
    setCurrentEmploye({ ...employe });
    setShowModal(true);
  }

  const handleDelete = async (id: number) => {
    const response = await deleteEmploye(id);
    setMessage(response.message);
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
          <IonHeader>
            <IonToolbar>
              <IonTitle>
                {currentEmploye.id ? 'Modifier' : 'Ajouter'} un employé
              </IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonContent className="modal-content">

            <div className="form-container">

              <IonItem className="input-item">
                <IonInput
                  label="Nom"
                  labelPlacement="stacked"
                  placeholder="Entrer le nom"
                  value={currentEmploye.nom}
                  onIonInput={(e) => {
                    setCurrentEmploye({
                      ...currentEmploye,
                      nom: e.detail.value! ?? ''
                    });
                  }}
                />
              </IonItem>

              <IonItem className="input-item">
                <IonInput
                  type="number"
                  label="Salaire"
                  labelPlacement="stacked"
                  placeholder="Entrer le salaire"
                  value={currentEmploye.salaire}
                  onIonInput={(e) => {
                    setCurrentEmploye({
                      ...currentEmploye,
                      salaire: Number(e.detail.value! ?? 0)
                    });
                  }}
                />
              </IonItem>

              <div className="modal-buttons">

                <IonButton expand="block" className="save-btn" onClick={handleSave}>
                  <IonIcon icon={checkmark} slot="start"></IonIcon>
                  Enregistrer
                </IonButton>

                <IonButton
                  expand="block"
                  className="cancel-btn"
                  color="dark"
                  onClick={() => setShowModal(false)}
                >
                  <IonIcon icon={close} slot="start"></IonIcon>
                  Annuler
                </IonButton>

              </div>

            </div>

          </IonContent>
        </IonModal>

        {/* Toast message */}
        <IonToast
          isOpen={toast}
          message={message || ''}
          duration={3000}
          position="top"
          cssClass="custom-toast"
          icon={checkmark}
          color="success"
          onDidDismiss={() => showToast(false)}
        >

        </IonToast>

      </IonContent>
    </IonPage>
  );
};

export default Tab2;