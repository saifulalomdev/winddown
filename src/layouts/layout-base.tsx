import { Outlet } from 'react-router-dom';

export function BaseLayout() {
  return (
    <main className="flex flex-col h-dvh pt-[calc(env(safe-area-inset-top)+8px)] px-4 scale-none">
        <Outlet />
    </main>
  );
}