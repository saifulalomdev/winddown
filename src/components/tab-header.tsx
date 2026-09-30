import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInternetConnection } from "@/hooks/use-internet-connection";
import { Search, Bell, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";
import { Header } from "@/components/header";

interface TabHeaderProps {
  showAvatar?: boolean;
  title?: string
}

export function TabHeader({ showAvatar, title }: TabHeaderProps) {
  const { user } = useAuth();
  const { isOnline } = useInternetConnection();
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <Header>
      <div className="flex justify-between items-center w-full sm:w-auto">
        {showAvatar && <div className="flex items-center gap-3">
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
        }
        {title && <h1 className="text-xl font-bold tracking-tight">{title}</h1>}
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="shrink-0 sm:hidden">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="shrink-0 sm:hidden">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Header>
  );
}