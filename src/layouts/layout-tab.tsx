import { AppTabs } from '@/components/app-tabs';
import { Outlet } from 'react-router-dom';

export function TabLayout() {
  return (
    <main className="flex-1 px-4 py-4">
      <div className="flex-1 overflow-y-auto pb-16 pt-16 px-2 space-y-4">
        <Outlet />
      </div>
      <AppTabs />
    </main>
  );
}