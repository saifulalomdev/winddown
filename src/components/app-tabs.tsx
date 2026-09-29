import { NavLink, useLocation } from "react-router-dom";
import {
  type LucideIcon,
  ShoppingBag,
  Settings2,
  Home,
  Package,
  Store,
} from "lucide-react";
import { cn } from "cn";

interface TabIconConfig {
  Icon: LucideIcon;
  label: string;
  path: string;
}

const tabItems: TabIconConfig[] = [
  { path: "/", Icon: Home, label: "Home" },
  { path: "/products", Icon: Package, label: "Products" },
  { path: "/orders", Icon: ShoppingBag, label: "Orders" },
  { path: "/outlets", Icon: Store, label: "Shops" },
  { path: "/settings", Icon: Settings2, label: "Settings" },
];

export function AppTabs() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-background px-4">
      <div className="mx-auto flex h-full max-w-md items-center justify-around">
        {tabItems.map((tab) => {
          const isFocused = location.pathname === tab.path;

          return (
            <Tab
              key={tab.path}
              tab={tab}
              isFocused={isFocused}
            />
          );
        })}
      </div>
    </nav>
  );
}

interface TabProps {
  tab: TabIconConfig;
  isFocused: boolean;
}

function Tab({ tab, isFocused }: TabProps) {
  const { Icon, label, path } = tab;

  return (
    <NavLink
      to={path}
      className={cn(
        "flex h-full w-14 flex-col items-center justify-center border-t-2 text-xs transition-colors",
        isFocused
          ? "border-primary text-primary font-semibold"
          : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="mt-1 text-[10px] font-medium leading-none">{label}</span>
    </NavLink>
  );
}