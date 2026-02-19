import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

const NETWORK_CHECK_INTERVAL_MS = 5000;

/**
 * Returns the current network connectivity state.
 * `isConnected` is `true` when the device has internet access, `false` when
 * offline, and `null` while the initial check is in progress.
 */
export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        if (!cancelled) {
          const reachable = state.isInternetReachable ?? state.isConnected ?? null;
          setIsConnected(reachable);
        }
      } catch {
        if (!cancelled) setIsConnected(null);
      }
    };

    check();

    const interval = setInterval(check, NETWORK_CHECK_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { isConnected };
};
