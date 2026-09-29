import { useInternetConnection } from "@/hooks/use-internet-connection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";
import {
  User,
  Wifi,
  WifiOff,
  RefreshCw,
  LogOut,
  Globe,
  Database,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";

export function SettingsPage() {
  const { user, signOut , isLoading } = useAuth();
  const { isOnline } = useInternetConnection();
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === "bn" ? "en" : "bn";
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-2 pb-1">
        <h1 className="text-xl font-bold tracking-tight">Settings</h1>
        <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-muted">
          {isOnline ? (
            <>
              <Wifi className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-700">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5 text-destructive" />
              <span className="text-destructive">Offline Mode</span>
            </>
          )}
        </div>
      </div>

      {/* User Profile Card */}
      <Card className="shadow-sm">
        <CardContent className="flex items-center gap-3.5 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-6 w-6" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{user?.name || "Field User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] uppercase font-semibold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
              DSR / SR Field Operations
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Data & Sync Section */}
      <Card className="shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Data & Sync
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 divide-y divide-border">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Database className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Pending Sync Queue</p>
                <p className="text-xs text-muted-foreground">Local SQLite storage</p>
              </div>
            </div>
            <span className="text-xs font-semibold bg-secondary px-2.5 py-1 rounded-full">
              0 Items
            </span>
          </div>

          <button
            onClick={() => console.log("Manual Sync Triggered")}
            className="flex items-center justify-between w-full py-3 text-left hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Force Local Sync</p>
                <p className="text-xs text-muted-foreground">Push pending queue now</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card className="shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 divide-y divide-border">
          <button
            onClick={toggleLanguage}
            className="flex items-center justify-between w-full py-3 text-left"
          >
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">App Language</p>
                <p className="text-xs text-muted-foreground">
                  {i18n.language === "bn" ? "বাংলা (Bengali)" : "English"}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-primary">Switch</span>
          </button>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <div className="pt-2">
        <Button
          disabled={isLoading}
          variant="destructive"
          className="w-full flex items-center justify-center gap-2 h-11"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
          {isLoading&& <Spinner/>}
        </Button>
      </div>
    </div>
  );
}