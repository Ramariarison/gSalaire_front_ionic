import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";
import ChartContainer from "../components/ChartContainer";

const Tab3: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Camembert des salaires</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <ChartContainer/>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;