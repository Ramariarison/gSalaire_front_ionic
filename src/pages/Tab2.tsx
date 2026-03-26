import { 
  IonPage, 
  IonToolbar, 
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonButton,
  IonIcon,
  IonHeader,
  IonFab,
  IonFabButton,
  IonModal,
  IonInput,
  IonToast,
  IonAlert,
  IonList,
  IonLabel
} from "@ionic/react";

import { useEffect, useState } from "react";
import { Employe } from "../types/Employe";
import { createEmploye, deleteEmploye, getEmployes, updateEmploye, getStats } from "../services/serviceEmploye";
import { add, checkmark, close, create, trash, arrowUp, cash, arrowDown } from "ionicons/icons";
import './Tab2.css';

const Tab2: React.FC = () => {

  const [employes, setEmployes] = useState<Employe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [toast, showToast] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [employeToDelete, setEmployeToDelete] = useState<Employe | null>(null);
  const [currentEmploye, setCurrentEmploye] = useState<Employe>({
    id: undefined,
    nom: '',
    salaire: 0,
    observation: ''
  });
  const [stats, setStats] = useState({
    salaire_total: 0,
    salaire_min: 0,
    salaire_max: 0
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
    employeStats();
  }, []);

  const handleSave = async () => {
    let response;

    if (currentEmploye.id !== undefined) {
      response = await updateEmploye(currentEmploye);
    } else {
      response = await createEmploye(currentEmploye);
    }

    setMessage(response.message);
    showToast(true);
    setShowModal(false);
    employeStats();
    fecthEmployes();
  }

  const handleEdit = (employe: Employe) => {
    setCurrentEmploye({ ...employe });
    setShowModal(true);
  }

  const handleDelete = async (id: number) => {
    const response = await deleteEmploye(id);
    setMessage(response.message);
    showToast(true);
    employeStats();
    fecthEmployes();
  }

  const employeStats = async () => {
    const response = await getStats();
    setStats(response);
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

        {/* Alert pour gérer la suppression d'un employé */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header={'Confirmer la suppression'}
          message={`Voulez vous vraiment supprimer l'employé ${employeToDelete?.nom} ?`}
          buttons={[
            {
              text: 'Annuler',
              role: 'cancel',
              handler: () => {
                setShowDeleteAlert(false);
              }
            },
            {
              text: 'Supprimer',
              role: 'destructive',
              handler: async () => {
                if (employeToDelete?.id !== undefined) {
                  await handleDelete(employeToDelete.id!);
                }
                setShowDeleteAlert(false);
              }
            }
          ]}  
        />
        
        {/* Liste des employés */}
        {!loading && !error && (
          <IonGrid className="table-container">

            <IonRow className="table-header">
              <IonCol size="1" className="id-col">ID</IonCol>
              <IonCol size="3">Nom</IonCol>
              <IonCol size="2">Salaire</IonCol>
              <IonCol size="3" className="observation-col">Obs</IonCol>
              <IonCol size="3" className="actions">Actions</IonCol>
            </IonRow>

            {employes.map((emp) => (
              <IonRow key={emp.id} className="table-row">

                <IonCol size="1" className="id-col">
                  {emp.id}
                </IonCol>

                <IonCol size="3">
                  {emp.nom}
                </IonCol>

                <IonCol size="2">
                  <span className="salary-badge">
                    {emp.salaire}
                  </span>
                </IonCol>

                <IonCol size="3" className="observation-col">
                  {emp.observation}
                </IonCol>

                <IonCol size="3" className="actions">

                  <IonButton 
                    fill="solid" 
                    className="edit-btn"
                    onClick={() => handleEdit(emp)}
                  >
                    <IonIcon icon={create}></IonIcon>
                  </IonButton>

                  <IonButton
                    fill="solid"
                    className="delete-btn"
                    onClick={() => {
                      if (emp.id !== undefined) {
                        setEmployeToDelete(emp);
                        setShowDeleteAlert(true);
                      }
                    }}
                  >
                    <IonIcon icon={trash}></IonIcon>
                  </IonButton>

                </IonCol>

              </IonRow>
            ))}

          </IonGrid>
        )}

        {/* Stats */}
        <IonList className="stats-list">
          <IonItem className="stat-item total">
            <IonIcon icon={cash} slot="start" className="stat-icon" />
            <IonLabel>
              <div className="stat-label">
                <h3>Total Salaire</h3>
                <p>{stats.salaire_total} Ar</p>
              </div>
            </IonLabel>
          </IonItem>

          <IonItem className="stat-item min">
            <IonIcon icon={arrowDown} slot="start" className="stat-icon" />
            <IonLabel>
              <div className="stat-label">
                <h3>Minimum Salaire</h3>
                <p>{stats.salaire_min} Ar</p>
              </div>
            </IonLabel>
          </IonItem>

          <IonItem className="stat-item max">
            <IonIcon icon={arrowUp} slot="start" className="stat-icon" />
            <IonLabel>
              <div className="stat-label">
                <h3>Maximum Salaire</h3>
                <p>{stats.salaire_max} Ar</p>
              </div>
            </IonLabel>
          </IonItem>
        </IonList>

        {/* Bouton ajouter */}
        <IonFab className="fab" vertical="bottom" horizontal="end">
          <IonFabButton className="fab-button"
            onClick={() => {
              setCurrentEmploye({ nom: '', salaire: 0, observation: '' });
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