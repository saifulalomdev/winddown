// src/features/auth/components/auth-guard.tsx
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "./auth-context";

export function AuthGuard() {
  const { user, session, isLoading, organizations } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    console.log(session)

    const inAuthGroup = location.pathname.startsWith("/auth");
    const isCreatingOrg = location.pathname === "/orgs/new";
    const isAuthenticated = Boolean(user && session);
    const hasOrg = Boolean(organizations && organizations.length > 0);

    // 1. Not logged in -> Redirect to login page
    if (!isAuthenticated && !inAuthGroup) {
      navigate("/auth", { replace: true });
      return;
    }

    // 2. Logged in, but on login/auth page -> Redirect based on org count
    if (isAuthenticated && inAuthGroup) {
      if (hasOrg) {
        navigate("/", { replace: true });
      } else {
        navigate("/orgs/new", { replace: true });
      }
      return;
    }

    // 3. Logged in, no organization, trying to access app pages -> Force /orgs/new
    if (isAuthenticated && !hasOrg && !isCreatingOrg) {
      navigate("/orgs/new", { replace: true });
      return;
    }

    // 4. Logged in, already has an org, but tries to visit /orgs/new -> Send back home
    if (isAuthenticated && hasOrg && isCreatingOrg) {
      navigate("/", { replace: true });
      return;
    }
  }, [user, session, isLoading, organizations, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-dvh bg-background">
        <Spinner className="size-8" />
      </div>
    );
  }

  return <Outlet />;
}