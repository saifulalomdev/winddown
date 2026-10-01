import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { AppAlert } from '@/components/app-alert';

export function CapacitorBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // State to control your custom alert modal
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  const locationRef = useRef(location);
  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    let activeListener: any = null;

    const setupBackButton = async () => {
      activeListener = await CapacitorApp.addListener('backButton', () => {
        const currentPath = locationRef.current.pathname.replace(/\/$/, '') || '/';

        // 1. If on root page, open the exit confirmation dialog
        if (currentPath === '/') {
          setIsExitDialogOpen(true);
          return;
        }

        // 2. If on main tab screens, go back to home dashboard
        const tabRoutes = ['/products', '/orders', '/outlets', '/settings'];
        if (tabRoutes.includes(currentPath)) {
          navigate('/', { replace: true });
          return;
        }

        // 3. For any other sub-page (e.g. /cart), go back or fallback to home
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

  // Function to handle app exit on confirmation
  const handleConfirmExit = () => {
    setIsExitDialogOpen(false);
    CapacitorApp.exitApp();
  };

  return (
    <AppAlert
      isOpen={isExitDialogOpen}
      onClose={() => setIsExitDialogOpen(false)}
      onConfirm={handleConfirmExit}
      title="Exit App?"
      description="Are you sure you want to close the app?"
      confirmLabel="Exit"
      cancelLabel="Cancel"
    />
  );
}