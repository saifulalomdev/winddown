import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';

export function CapacitorBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationRef = useRef(location);
  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    let activeListener: { remove: () => void } | null = null;

    const setupBackButton = async () => {
      // Disable default Capacitor back button handling
      await CapacitorApp.toggleBackButtonHandler({ enabled: false });

      activeListener = await CapacitorApp.addListener('backButton', () => {
        const currentPath = locationRef.current.pathname.replace(/\/$/, '') || '/';

        // 1. If on root page, exit the app
        if (currentPath === '/') {
          CapacitorApp.exitApp();
          return;
        }

        // 2. If on main tab screens, go back to home dashboard
        const tabRoutes = ['/products', '/orders', '/outlets', '/settings'];
        if (tabRoutes.includes(currentPath)) {
          navigate('/', { replace: true });
          return;
        }

        // 3. For any other page (e.g. /cart), go back or fallback to home
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate('/', { replace: true });
        }
      });
    };

    setupBackButton();

    return () => {
      if (activeListener) {
        activeListener.remove();
      }
    };
  }, [navigate]);

  return null;
}