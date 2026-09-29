import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthLayout } from '@/layouts/auth-layout';
import { AuthProvider, AuthGuard, AuthIndex } from './features/auth';
import BaseLayout from './layouts/base-layout';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AuthGuard />}>
            
            <Route path="/" element={<BaseLayout />}>
              <Route index element={<div>Tabs Content this</div>} />
            </Route>

            <Route path="auth" element={<AuthLayout />}>
              <Route index element={<AuthIndex />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />

          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}