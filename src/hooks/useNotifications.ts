import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { toast } from 'react-toastify';
import { messaging, requestForToken } from '../config/firebase';
import { notificationAPI } from '../api/notifications';
import { useAuth } from '../contexts/AuthContext';

export const useNotifications = () => {
    const { isAuthenticated, tokens } = useAuth();
    const accessToken = tokens?.accessToken || null;

    useEffect(() => {
        if (!isAuthenticated) return;

        // 1. WebSocket Setup
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
        const wsBaseUrl = apiUrl.replace(/^http/, 'ws').replace(/\/$/, '');
        const wsUrl = `${wsBaseUrl}/ws/notifications/${accessToken ? `?token=${accessToken}` : ''}`;

        console.log('Connecting to WebSocket:', wsUrl);
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log('WebSocket Connected');
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('WebSocket Message:', data);

                const msg = data.message || data.body;
                const title = data.title;

                if (msg) {
                    toast.info(`${title ? title + ': ' : ''}${msg}`);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        // 2. FCM Setup
        const setupFCM = async () => {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    const token = await requestForToken();
                    if (token) {
                        await notificationAPI.saveFCMToken(token);
                    }
                } else {
                    console.log('Notification permission denied');
                }
            } catch (error) {
                console.error('FCM Setup Failed:', error);
            }
        };

        setupFCM();

        // Handle foreground messages from FCM
        let unsubscribeFCM: (() => void) | undefined;
        if (messaging) {
            unsubscribeFCM = onMessage(messaging, (payload) => {
                console.log('FCM Foreground Message (logged only):', payload);

                // Optional: If you want foreground system notifications,
                // uncomment this block, but be careful of duplicates:
                /*
                const title =
                    payload.notification?.title ||
                    payload.data?.title ||
                    'New Notification';

                const body =
                    payload.notification?.body ||
                    payload.data?.body ||
                    payload.data?.message ||
                    '';

                if (Notification.permission === 'granted' && body) {
                    try {
                        new Notification(title, {
                            body,
                            icon: payload.data?.icon || 'https://admin.fernrie.com/logo.png'
                        });
                    } catch (e) {
                        console.error('System notification failed', e);
                    }
                }
                */
            });

        }

        return () => {
            socket.close();
            if (unsubscribeFCM) unsubscribeFCM();
        };
    }, [isAuthenticated, accessToken]);
};
