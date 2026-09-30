import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInternetConnection } from "@/hooks/use-internet-connection";
import { Bell, Wifi, WifiOff, RefreshCw, CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";
import { Header } from "@/components/header";

export function DashboardHeader() {
  const { user } = useAuth();
  const { isOnline } = useInternetConnection();
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const pendingSyncCount = 30;

  return (
    <Header>
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

            <div className="flex items-center gap-1.5 text-xs font-medium pt-1">
              <p>Admin |</p>
              {isOnline ? (
                <>
                  <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5 text-destructive" />
                  <span className="text-destructive">Offline</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Offline / Sync Queue Action */}
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 relative sm:hidden"
            onClick={() => alert('Syncing offline queue...')}
          >
            {isOnline ? (
              <RefreshCw className="h-4 w-4 text-emerald-600" />
            ) : (
              <CloudOff className="h-4 w-4 text-red-500" />
            )}

            {/* Badge showing pending offline changes */}
            {pendingSyncCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {pendingSyncCount}
              </span>
            )}
          </Button>

          {/* Notifications Action */}
          <Button variant="outline" size="icon" className="shrink-0 sm:hidden">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Header>
  );
}