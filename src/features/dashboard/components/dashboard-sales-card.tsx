import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const recentTransactions = [
  { id: "1", name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", avatar: "OM" },
  { id: "2", name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", avatar: "JL" },
  { id: "3", name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", avatar: "IN" },
  { id: "4", name: "William Kim", email: "will@email.com", amount: "+$99.00", avatar: "WK" },
  { id: "5", name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", avatar: "SD" },
];

export function RecentSalesCard() {
  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>You made 265 sales this month.</CardDescription>
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
  );
}