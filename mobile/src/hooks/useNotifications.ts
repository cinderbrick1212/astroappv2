import { useEffect, useRef } from 'react';
import { notifications } from '../services/notifications';
import api from '../api';

/**
 * Registers the device for push notifications on mount, syncs the token to
 * the backend, and wires up foreground / tap listeners.
 * Call once from the root App component.
 */
export const useNotifications = () => {
  const foregroundSub = useRef<ReturnType<typeof notifications.addReceivedListener> | null>(null);
  const responseSub = useRef<ReturnType<typeof notifications.addResponseListener> | null>(null);

  useEffect(() => {
    (async () => {
      const token = await notifications.registerForPushNotifications();
      if (token) {
        // Sync token to backend so the server can reach this device
        try {
          await api.put('/users/me/push-token', { push_token: token });
        } catch {
          // Non-critical — backend may be unavailable
        }
      }
    })();

    foregroundSub.current = notifications.addReceivedListener(() => {
      // Handle foreground notification (badge update, etc.)
    });

    responseSub.current = notifications.addResponseListener(() => {
      // Handle notification tap – could navigate to a specific screen
    });

    return () => {
      foregroundSub.current?.remove();
      responseSub.current?.remove();
    };
  }, []);
};
