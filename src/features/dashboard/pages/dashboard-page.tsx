import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardHeader } from "../components/dashboard-header";
import { DashboardMetrics } from "../components/dashboard-metrics";
import { RecentSalesCard } from "../components/dashboard-sales-card";

export function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background px-6 space-y-8 py-4">
      <DashboardHeader />
      <DashboardMetrics />

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Monthly transaction volume across all channels.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t border-dashed my-2 rounded-md bg-muted/20">
            <p className="text-sm text-muted-foreground">[ Chart Component Goes Here ]</p>
          </CardContent>
        </Card>

        <RecentSalesCard />
      </div>
    </div>
  );
}