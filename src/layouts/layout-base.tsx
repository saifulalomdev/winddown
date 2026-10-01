import { Outlet } from 'react-router-dom';

export function BaseLayout() {
  return (
    <main className="felx flex-col h-dvh pt-[calc(env(safe-area-inset-top)+8px)] scale-none">
      <Outlet />
    </main>
  );
}