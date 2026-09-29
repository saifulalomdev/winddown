import {
    Users,
    CreditCard,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth";

// Dummy Metrics Data
const metrics = [
    {
        title: "Total Revenue",
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

// Dummy Recent Transactions
const recentTransactions = [
    {
        id: "1",
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        amount: "+$1,999.00",
        avatar: "OM",
        status: "Completed",
    },
    {
        id: "2",
        name: "Jackson Lee",
        email: "jackson.lee@email.com",
        amount: "+$39.00",
        avatar: "JL",
        status: "Processing",
    },
    {
        id: "3",
        name: "Isabella Nguyen",
        email: "isabella.nguyen@email.com",
        amount: "+$299.00",
        avatar: "IN",
        status: "Completed",
    },
    {
        id: "4",
        name: "William Kim",
        email: "will@email.com",
        amount: "+$99.00",
        avatar: "WK",
        status: "Completed",
    },
    {
        id: "5",
        name: "Sofia Davis",
        email: "sofia.davis@email.com",
        amount: "+$39.00",
        avatar: "SD",
        status: "Failed",
    },
];

export function DashboardPage() {
    const { user } = useAuth();
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <div className="flex flex-col min-h-screen bg-background p-6 space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {userInitial}
                            </AvatarFallback>
                        </Avatar>
                        <div >
                            <p className="text-sm font-semibold leading-none">
                                {user?.name ?? "Field Agent"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                DSR
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" size="icon" className="shrink-0">
                        <Bell className="h-4 w-4" />
                    </Button>

                </div>
                {/* Left Side: Actions, Bell, and Search */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-8 bg-card"
                        />
                    </div>
                </div>

            </header>

            {/* Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric, i) => {
                    const Icon = metric.icon;
                    return (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {metric.title}
                                </CardTitle>
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
                                    <span
                                        className={
                                            metric.isPositive ? "text-emerald-500" : "text-rose-500"
                                        }
                                    >
                                        {metric.change}
                                    </span>
                                    <span className="ml-1">from last month</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Main Content Sections */}
            <div className="grid gap-6 md:grid-cols-7">
                {/* Analytics Chart Placeholder */}
                <Card className="md:col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>
                            Monthly transaction volume across all channels.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center border-t border-dashed my-2 rounded-md bg-muted/20">
                        <p className="text-sm text-muted-foreground">
                            [ Chart Component Goes Here ]
                        </p>
                    </CardContent>
                </Card>

                {/* Recent Activity List */}
                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                        <CardDescription>
                            You made 265 sales this month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {recentTransactions.map((item) => (
                                <div key={item.id} className="flex items-center justify-between space-x-4">
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src="" />
                                            <AvatarFallback>{item.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">{item.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium">{item.amount}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}