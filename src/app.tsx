import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthLayout } from '@/layouts/auth-layout';
import { AuthProvider } from './features/auth';
import BaseLayout from './layouts/base-layout';
import { AuthIndex } from './features/auth';
import { AuthGuard } from './features/auth';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthGuard>
          <Routes>
            <Route path="/" element={<BaseLayout />}>
              <Route path="auth" element={<AuthLayout />}>
                <Route index element={<AuthIndex />} />
              </Route>
            </Route>
          </Routes>
        </AuthGuard>
      </AuthProvider>
    </BrowserRouter>
  );
}