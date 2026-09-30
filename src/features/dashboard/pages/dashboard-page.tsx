import { DashboardHeader } from "../components/dashboard-header";
import { DashboardMetrics } from "../components/dashboard-metrics";
import { RecentSalesCard } from "../components/dashboard-sales-card";

export function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <DashboardMetrics />
      <RecentSalesCard/>
    </>
  );
}