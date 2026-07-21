import {
  IonContent,
  IonPage,
  IonButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonIcon,
  IonAvatar,
  IonText,
  IonSpinner,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import { BackgroundGeolocation } from '@capgo/background-geolocation';
import { Header } from '../components/Header';
import { logInOutline, logOutOutline, locationOutline, timeOutline } from 'ionicons/icons';
import './Home.css';

const Home: React.FC = () => {
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [employeeName, setEmployeeName] = useState<string>('');
  const [employeeInitials, setEmployeeInitials] = useState<string>('?');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    Preferences.get({ key: 'employee' }).then(({ value }) => {
      if (value) {
        const emp = JSON.parse(value);
        const name = emp.name || emp.email || 'User';
        setEmployeeName(name);
        const initials = name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        setEmployeeInitials(initials || '?');
      }
    });
  }, []);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await BackgroundGeolocation.start(
        {
          backgroundMessage: 'App is tracking your location in the background.',
          backgroundTitle: 'Live Tracker Active',
          requestPermissions: true,
          stale: false,
          distanceFilter: 10,
        },
        (location, error) => {
          if (error) {
            console.error('Location error:', error);
            return;
          }
          if (location) {
            setCurrentCoords({ lat: location.latitude, lng: location.longitude });
            setLastUpdated(new Date().toLocaleTimeString());
          }
        }
      );
      setIsCheckedIn(true);
    } catch (e) {
      console.error('Failed to check in:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      await BackgroundGeolocation.stop();
      setIsCheckedIn(false);
      setCurrentCoords(null);
      setLastUpdated('');
    } catch (e) {
      console.error('Failed to check out:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheckIn = async () => {
    if (isCheckedIn) {
      await handleCheckOut();
    } else {
      await handleCheckIn();
    }
  };

  const coordDisplay = currentCoords
    ? `${currentCoords.lat.toFixed(6)}, ${currentCoords.lng.toFixed(6)}`
    : 'No location yet';

  return (
    <IonPage>
      <Header employeeName={employeeName} />

      <IonContent className="ion-padding">
        {/* Top: Welcome + Status Card */}
        <div className="top-section">
          <div className="welcome-section">
            <IonAvatar className="avatar">
              <div className="avatar-initials">{employeeInitials}</div>
            </IonAvatar>
            <div className="welcome-text">
              <IonText color="dark">
                <h2>Welcome back,</h2>
                <h1>{employeeName}</h1>
              </IonText>
            </div>
          </div>

          <IonCard className="status-card">
            <IonCardContent>
              <div className="status-row">
                <div className="status-indicator">
                  <IonChip color={isCheckedIn ? 'success' : 'medium'}>
                    <IonIcon icon={isCheckedIn ? 'radio-button-on' : 'radio-button-off'} />
                    <span>{isCheckedIn ? 'Checked In' : 'Checked Out'}</span>
                  </IonChip>
                </div>
                {lastUpdated && (
                  <div className="timestamp">
                    <IonIcon icon={timeOutline} />
                    <span>Updated: {lastUpdated}</span>
                  </div>
                )}
              </div>

              <div className="location-display">
                <IonIcon icon={locationOutline} className="location-icon" />
                <IonText>
                  <p className="coords-text">{coordDisplay}</p>
                </IonText>
              </div>

              {!currentCoords && !isCheckedIn && (
                <IonText color="medium" className="hint-text">
                  <p>Tap the button to check in</p>
                </IonText>
              )}
            </IonCardContent>
          </IonCard>
        </div>

        {/* Bottom: Circular Action Button */}
        <div className="button-wrapper">
          <IonButton
            shape="round"
            color={isCheckedIn ? 'danger' : 'success'}
            onClick={toggleCheckIn}
            disabled={loading}
            className="circle-btn"
          >
            {loading ? (
              <IonSpinner name="crescent" />
            ) : (
              <>
                <IonIcon icon={isCheckedIn ? logOutOutline : logInOutline} />
                <span>{isCheckedIn ? 'Check Out' : 'Check In'}</span>
              </>
            )}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;