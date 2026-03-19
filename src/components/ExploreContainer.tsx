import './ExploreContainer.css';
import { people } from 'ionicons/icons';
import { IonButton, IonIcon } from '@ionic/react';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div className="container">
      <strong>
        {name}
      </strong>
      <p>Application permettant de gérer efficacement les employés et leurs informations.</p>
      <IonButton routerLink='/tab2' color={'light'}>
        <IonIcon slot='start' icon={people}></IonIcon>
        Voir employés
      </IonButton>
    </div>
  );
};

export default ExploreContainer;
