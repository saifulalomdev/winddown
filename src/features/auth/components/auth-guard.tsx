// src/features/auth/components/auth-guard.tsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "./auth-context";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    // Checks if the current path starts with /auth
    const inAuthGroup = location.pathname.startsWith("/auth");

    if (!user && !inAuthGroup) {
      navigate("/auth", { replace: true });
    } else if (user && inAuthGroup) {
      navigate("/", { replace: true });
    }
  }, [user, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-dvh bg-background">
        <Spinner className="size-8" />
      </div>
    );
  }

  return <>{children}</>;
}