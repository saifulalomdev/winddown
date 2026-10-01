import { Users, CreditCard, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  {
    title: "Total Sales",
    value: "$45,231.89",
    change: "+20.1%",
    isPositive: true,
    icon: CreditCard,
  },
  {
    title: "Active Subscriptions",
    value: "+2,350",
    change: "+180.1%",
    isPositive: true,
    icon: Users,
  },
  {
    title: "Sales Count",
    value: "+12,234",
    change: "+19%",
    isPositive: true,
    icon: Activity,
  },
  {
    title: "Pending Invoices",
    value: "$573.00",
    change: "-4.5%",
    isPositive: false,
    icon: CreditCard,
  },
];

export function DashboardMetrics() {
  return (
    <>
      {metrics.map((metric, i) => {
        const Icon = metric.icon;
        return (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {metric.isPositive ? (
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500 mr-0.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 text-rose-500 mr-0.5" />
                )}
                <span className={metric.isPositive ? "text-emerald-500" : "text-rose-500"}>
                  {metric.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}