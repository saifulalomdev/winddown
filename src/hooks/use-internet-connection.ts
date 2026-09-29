import { useEffect, useState } from 'react';
import { Network } from '@capacitor/network';

export function useInternetConnection() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // Initial check
    Network.getStatus().then((status) => {
      setIsOnline(status.connected);
    });

    // Listen for real-time network changes
    const listener = Network.addListener('networkStatusChange', (status) => {
      setIsOnline(status.connected);
    });

    return () => {
      listener.then((handle) => handle.remove());
    };
  }, []);

  return { isOnline };
}