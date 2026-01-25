importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Parse config from URL query parameters
const params = new URLSearchParams(self.location.search);

const firebaseConfig = {
    apiKey: params.get('apiKey'),
    authDomain: params.get('authDomain'),
    projectId: params.get('projectId'),
    storageBucket: params.get('storageBucket'),
    messagingSenderId: params.get('messagingSenderId'),
    appId: params.get('appId')
};

// Only initialize if config is present (prevents errors on direct file access)
if (firebaseConfig.apiKey) {
    firebase.initializeApp(firebaseConfig);
} else {
    console.error('Firebase Config missing in SW URL params');
}

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const data = payload.data || {};
    const title = data.title || payload.notification?.title || 'Fernrei Accounts';
    const body = data.body || data.message || payload.notification?.body || 'You have a new transaction';
    const notificationOptions = {
        body: body,
        icon: data.icon || '/logo.png',
        data: data
    };

    self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});
