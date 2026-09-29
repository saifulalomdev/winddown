import { AppTabs } from '@/components/app-tabs';
import { Outlet } from 'react-router-dom';

export function TabLayout() {
  return (
    <main className="flex-1">
      <div className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </div>
      
      <AppTabs />
    </main>
  );
}