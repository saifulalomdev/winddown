import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, AuthGuard, AuthIndex } from './features/auth';
import { TabLayout } from './layouts/layout-tab';
import { BaseLayout } from './layouts/layout-base';
import { SettingsPage } from './features/settings/pages/settings-page';
import { DashboardPage } from './features/dashboard/pages/dashboard-page';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AuthGuard />}>
            <Route element={<BaseLayout />}>
              <Route path="/" element={<TabLayout />}>
                <Route index element={<DashboardPage/>} />
                <Route path='products' element={<div>Products Content this</div>} />
                <Route path='orders' element={<div>Products Content this</div>} />
                <Route path='outlets' element={<div>Products Content this</div>} />
                <Route path='settings' element={<SettingsPage/>} />
              </Route>
              <Route path="auth" element={<AuthIndex />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}