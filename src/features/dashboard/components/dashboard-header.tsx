import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInternetConnection } from "@/hooks/use-internet-connection";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth";

export function DashboardHeader() {
  const { user } = useAuth();
  const { isOnline } = useInternetConnection();
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
      <div className="flex justify-between items-center w-full sm:w-auto">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold leading-none">
              {user?.name ?? "Field Agent"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              DSR || {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <Button variant="outline" size="icon" className="shrink-0 sm:hidden">
          <Bell className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="pl-8 bg-card" />
        </div>
        <Button variant="outline" size="icon" className="shrink-0 hidden sm:flex">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}