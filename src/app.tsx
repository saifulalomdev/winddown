import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, AuthGuard, AuthIndex } from './features/auth';
import { TabLayout } from './layouts/layout-tab';
import { BaseLayout } from './layouts/layout-base';
import { SettingsPage } from './features/settings/pages/settings-page';
import { DashboardPage } from './features/dashboard/pages/dashboard-page';
import { useEffect, useState } from 'react';
import { initI18n } from './lib/i18n';
import { ThemeProvider } from './components/theme-provider';

export default function App() {
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    initI18n().then(() => setIsI18nReady(true));
  }, []);

  if (!isI18nReady) {
    return null; // Or show a loading spinner
  }
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="user_theme">
        <AuthProvider>
          <Routes>
            <Route element={<AuthGuard />}>
              <Route element={<BaseLayout />}>
                <Route path="/" element={<TabLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path='products' element={<div>Products Content this</div>} />
                  <Route path='orders' element={<div>Products Content this</div>} />
                  <Route path='outlets' element={<div>Products Content this</div>} />
                  <Route path='settings' element={<SettingsPage />} />
                </Route>
                <Route path="auth" element={<AuthIndex />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}