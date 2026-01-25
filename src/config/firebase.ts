import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

let messaging: any = null;

try {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        messaging = getMessaging(app);
    }
} catch (error) {
    console.error('Firebase messaging initialization failed:', error);
}

// Use VAPID Key from env
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;
export const requestForToken = async () => {
    try {
        if ('serviceWorker' in navigator) {
            // Try to use existing registration (from VitePWA) first
            let registration = await navigator.serviceWorker.getRegistration();

            // If no registration or if we want to ensure we have one that can handle FCM
            if (!registration) {
                const swUrl = new URL('/firebase-messaging-sw.js', window.location.origin);
                swUrl.searchParams.append('apiKey', firebaseConfig.apiKey);
                swUrl.searchParams.append('authDomain', firebaseConfig.authDomain);
                swUrl.searchParams.append('projectId', firebaseConfig.projectId);
                swUrl.searchParams.append('storageBucket', firebaseConfig.storageBucket);
                swUrl.searchParams.append('messagingSenderId', firebaseConfig.messagingSenderId);
                swUrl.searchParams.append('appId', firebaseConfig.appId);

                registration = await navigator.serviceWorker.register(swUrl.toString());
            }

            const currentToken = await getToken(messaging, {
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: registration
            });
            if (currentToken) {
                console.log('FCM Token:', currentToken);
                return currentToken;
            } else {
                console.log('No registration token available. Request permission to generate one.');
                return null;
            }
        }
    } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
        return null;
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        if (!messaging) {
            resolve(null);
            return;
        }
        onMessage(messaging, (payload) => {
            console.log("payload", payload);
            resolve(payload);
        });
    });

export { messaging, getToken, onMessage };
export default app;
