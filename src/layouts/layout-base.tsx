import { Outlet } from 'react-router-dom';

export  function BaseLayout() {
  return (
    <main className="felx flex-col h-dvh pt-[env(safe-area-inset-top)] scale-none">
      <Outlet />
    </main>
  );
}