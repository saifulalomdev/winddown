import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInternetConnection } from "@/hooks/use-internet-connection";
import { Bell, Wifi, WifiOff, RefreshCw, CloudOff, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";
import { Header } from "@/components/header";

export function DashboardHeader() {
  const { activeOrganization, organizations, setActiveOrganization } = useAuth();
  const { isOnline } = useInternetConnection();

  const orgName = activeOrganization?.name ?? "No Route Selected";
  const orgInitial = orgName.charAt(0).toUpperCase();
  const pendingSyncCount = 30;

  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId) {
      setActiveOrganization(selectedId);
    }
  };

  return (
    <Header>
      <div className="flex justify-between items-center w-full sm:w-auto">
        <div className="flex items-center gap-3">
          {/* Active Organization Logo */}
          <Avatar className="h-10 w-10">
            <AvatarImage src={activeOrganization?.logo ?? ""} alt={orgName} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {orgInitial}
            </AvatarFallback>
          </Avatar>

          <div>
            {/* Active Organization Selector / Display */}
            {organizations.length > 1 ? (
              <div className="relative flex items-center">
                <select
                  value={activeOrganization?.id ?? ""}
                  onChange={handleOrgChange}
                  className="text-sm font-semibold leading-none bg-transparent appearance-none pr-4 focus:outline-none cursor-pointer"
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3.5 w-3.5 opacity-50 absolute right-0 pointer-events-none" />
              </div>
            ) : (
              <p className="text-sm font-semibold leading-none">{orgName}</p>
            )}

            {/* Connection Status */}
            <div className="flex items-center gap-1.5 text-xs font-medium pt-1">
              <p className="uppercase">{activeOrganization?.role} |</p>
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
          {/* Offline Sync Action Button */}
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 relative sm:hidden"
            onClick={() => alert("Syncing offline queue...")}
          >
            {isOnline ? (
              <RefreshCw className="h-4 w-4 text-emerald-600" />
            ) : (
              <CloudOff className="h-4 w-4 text-red-500" />
            )}

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