import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonPopover,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonAvatar,
} from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { BackgroundGeolocation } from '@capgo/background-geolocation';
import { personOutline, logOutOutline } from 'ionicons/icons';
import './Header.css'; // we'll add styles

interface HeaderProps {
  employeeName: string;
}

export const Header: React.FC<HeaderProps> = ({ employeeName }) => {
  const history = useHistory();
  const [popoverEvent, setPopoverEvent] = useState<MouseEvent | null>(null);
  const [showPopover, setShowPopover] = useState(false);

  // Get initials (max 2 characters)
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    setPopoverEvent(e.nativeEvent);
    setShowPopover(true);
  };

  const handleLogout = async () => {
    setShowPopover(false);
    await BackgroundGeolocation.stop().catch(() => {});
    await Preferences.remove({ key: 'token' });
    await Preferences.remove({ key: 'employee' });
    history.replace('/login');
  };

  const handleProfileNavigation = () => {
    setShowPopover(false);
    // Navigate to profile page (when ready)
    console.log('Navigate to Profile');
    // history.push('/profile');
  };

  return (
    <>
      <IonHeader className="premium-header">
        <IonToolbar>
          <IonTitle className="app-title">Amrutha Automobiles</IonTitle>
          <IonButtons slot="end">
            <IonAvatar
              onClick={handleProfileClick}
              className="profile-avatar"
            >
              <div className="avatar-initials">
                {getInitials(employeeName)}
              </div>
            </IonAvatar>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonPopover
        event={popoverEvent}
        isOpen={showPopover}
        onDidDismiss={() => setShowPopover(false)}
        className="premium-popover"
        side="bottom"
        alignment="end"
      >
        <IonContent>
          <IonList lines="none" className="popover-list">
            <IonItem button onClick={handleProfileNavigation} className="popover-item">
              <IonIcon icon={personOutline} slot="start" />
              <IonLabel>Profile</IonLabel>
            </IonItem>
            <IonItem button onClick={handleLogout} className="popover-item logout-item">
              <IonIcon icon={logOutOutline} slot="start" color="danger" />
              <IonLabel color="danger">Logout</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>
    </>
  );
};