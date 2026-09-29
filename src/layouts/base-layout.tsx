import { useAuth } from '@/features/auth';
import { Outlet } from 'react-router-dom';

export default function BaseLayout() {
  const { isLoading, user, session } = useAuth();
  console.log(isLoading, user, session)

  return (
    <main className="overflow-hidden h-dvh">
      <Outlet />
    </main>
  );
}