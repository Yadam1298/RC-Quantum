import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonButton,
    useIonViewWillEnter
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import axios from 'axios';

const Login: React.FC = () => {
    const history = useHistory();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useIonViewWillEnter(() => {
        Preferences.get({ key: 'token' }).then(({ value }) => {
            if (value) {
                history.replace('/home');
            }
        });
    });

    const handleLogin = async () => {
        if (!identifier.trim() || !password.trim()) {
            setErrorMessage("Please enter Employee ID/Email and Password.");
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");

            const response = await axios.post(
                "http://192.168.0.6:5000/api/auth/login",
                {
                    identifier: identifier,
                    password: password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const { token, employee } = response.data;

            // Save login session
            await Preferences.set({
                key: "token",
                value: token,
            });

            await Preferences.set({
                key: "employee",
                value: JSON.stringify(employee),
            });

            console.log("Login Success");
            console.log(token);
            console.log(employee);

            // Navigate to Home
            history.replace("/home");

        } catch (err: any) {

            const debug = JSON.stringify(
                {
                    message: err.message,
                    code: err.code,
                    status: err.response?.status,
                    response: err.response?.data,
                    headers: err.response?.headers,
                    config: {
                        url: err.config?.url,
                        method: err.config?.method,
                        timeout: err.config?.timeout,
                    },
                },
                null,
                2
            );

            console.log(debug);
            setErrorMessage(debug);
        } finally {
            setLoading(false);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                    <h2>Welcome Back</h2>

                    {errorMessage && <p style={{ color: 'var(--ion-color-danger)' }}>{errorMessage}</p>}

                    <IonItem>
                        <IonInput
                            label="Email or Emp ID"
                            labelPlacement="stacked"
                            placeholder="Enter email or employee ID"
                            value={identifier}
                            onIonInput={(e) => setIdentifier(e.detail.value!)}
                        ></IonInput>
                    </IonItem>

                    <IonItem style={{ marginBottom: '20px' }}>
                        <IonInput
                            label="Password"
                            type="password"
                            labelPlacement="stacked"
                            placeholder="Enter password"
                            value={password}
                            onIonInput={(e) => setPassword(e.detail.value!)}
                        ></IonInput>
                    </IonItem>

                    <IonButton expand="block" color="primary" onClick={handleLogin} disabled={loading}>
                        {loading ? 'Logging In...' : 'Log In'}
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;