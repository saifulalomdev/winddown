import { useEffect, useState, useCallback } from 'react';
import { Network } from '@capacitor/network';

export function useInternetConnection(
  pingUrl = 'https://google.com',
  timeoutMs = 3500
) {
  const [isOnline, setIsOnline] = useState<boolean>(false);

  const checkRealConnectivity = useCallback(async () => {
    const status = await Network.getStatus();
    if (!status.connected) {
      setIsOnline(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      await fetch(pingUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setIsOnline(true);
    } catch (error) {
      clearTimeout(timeoutId);
      setIsOnline(false);
    }
  }, [pingUrl, timeoutMs]);

  useEffect(() => {
    checkRealConnectivity();

    const listener = Network.addListener('networkStatusChange', (status) => {
      if (!status.connected) {
        setIsOnline(false);
      } else {
        checkRealConnectivity();
      }
    });

    // 30-second heartbeat check for silent drops
    const heartbeat = setInterval(checkRealConnectivity, 30000);

    return () => {
      listener.then((handle) => handle.remove());
      clearInterval(heartbeat);
    };
  }, [checkRealConnectivity]);

  return { isOnline };
}
