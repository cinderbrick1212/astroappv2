import { useEffect, useRef } from 'react';
import { notifications } from '../services/notifications';

/**
 * Registers the device for push notifications on mount and wires up
 * foreground / tap listeners.  Call once from the root App component.
 */
export const useNotifications = () => {
  const foregroundSub = useRef<ReturnType<typeof notifications.addReceivedListener> | null>(null);
  const responseSub = useRef<ReturnType<typeof notifications.addResponseListener> | null>(null);

  useEffect(() => {
    notifications.registerForPushNotifications();

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
