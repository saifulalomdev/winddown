// src/features/auth/components/auth-guard.tsx
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "./auth-context";

export function AuthGuard() {
  const { user, session, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = location.pathname.startsWith("/auth");
    const isAuthenticated = Boolean(user && session);

    if (!isAuthenticated && !inAuthGroup) {
      navigate("/auth", { replace: true });
    }
    else if (isAuthenticated && inAuthGroup) {
      navigate("/", { replace: true });
    }
  }, [user, session, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-dvh bg-background">
        <Spinner className="size-8" />
      </div>
    );
  }

  return <Outlet/>
}