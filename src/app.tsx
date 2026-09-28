import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import { AuthLayout } from '@/layouts/auth-layout';
import { AuthIndex } from './features/auth';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route path="auth" element={<AuthLayout />}>
            <Route index element={<AuthIndex />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}