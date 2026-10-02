import { useEffect, useState, useCallback } from "react";
import { authClient } from "./auth-client";
import { Storage } from "@/utils/storage-helper";
import { Network } from "@capacitor/network";
import type { AuthData } from "./auth-types";
import { fetchFreshAuthData } from "./auth-utils";

const AUTH_CACHE_KEY = "cached_auth_data";

export function useAuthState() {
  const [authData, setAuthDataState] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Sync React state and local storage
  const setAuthData = useCallback((data: AuthData | null) => {
    setAuthDataState(data);
    if (data) {
      Storage.set(AUTH_CACHE_KEY, data).catch((err) =>
        console.error("Failed to cache auth data:", err)
      );
    } else {
      Storage.delete(AUTH_CACHE_KEY).catch((err) =>
        console.error("Failed to remove cached auth data:", err)
      );
    }
  }, []);

  // Offline-first active organization switcher
  const setActiveOrganization = useCallback(
    async (orgId: string) => {
      if (!authData) return;

      // 1. Immediately update local state & local storage (Offline-First)
      const updatedData: AuthData = {
        ...authData,
        activeOrganizationId: orgId,
        session: {
          ...authData.session,
          activeOrganizationId: orgId,
        },
      };

      setAuthData(updatedData);

      // 2. Try syncing with Better Auth server if online
      const status = await Network.getStatus();
      if (status.connected) {
        try {
          await authClient.organization.setActive({ organizationId: orgId });
        } catch (err) {
          console.warn("Failed to sync active organization online:", err);
        }
      }
    },
    [authData, setAuthData]
  );

  useEffect(() => {
    async function initAuth() {
      setIsLoading(true);

      // 1. Read local storage first for instant loading
      let localAuth: AuthData | null = null;
      try {
        localAuth = await Storage.get<AuthData>(AUTH_CACHE_KEY);
        if (localAuth?.user && localAuth?.session) {
          setAuthDataState(localAuth);
        }
      } catch (err) {
        console.error("Failed to read cached auth session:", err);
      }

      // 2. Fetch fresh data if online
      const status = await Network.getStatus();

      if (status.connected) {
        try {
          const freshData = await fetchFreshAuthData();
          if (freshData) {
            // Preserve locally saved active org if session lacks one
            const activeId =
              freshData.session?.activeOrganizationId ||
              localAuth?.activeOrganizationId ||
              freshData.organizations[0]?.id ||
              null;

            setAuthData({
              ...freshData,
              activeOrganizationId: activeId,
            });
          }
        } catch (error) {
          console.warn("Online session check failed:", error);
          if (!localAuth) setAuthData(null);
        }
      } else if (!localAuth) {
        setAuthData(null);
      }

      setIsLoading(false);
    }

    initAuth();
  }, [setAuthData]);

  const signOut = async () => {
    try {
      setIsLoggingOut(true);
      const status = await Network.getStatus();
      if (status.connected) {
        await authClient.signOut();
      }
    } catch (err) {
      console.error("Remote sign out failed:", err);
    } finally {
      setAuthData(null);
      setIsLoggingOut(false);
    }
  };

  // Derive active organization object
  const activeOrgId =
    authData?.activeOrganizationId ||
    authData?.session?.activeOrganizationId;

  const activeOrganization =
    authData?.organizations.find((org) => org.id === activeOrgId) ||
    authData?.organizations[0] ||
    null;

  return {
    isLoading,
    isLoggingOut,
    user: authData?.user ?? null,
    session: authData?.session ?? null,
    organizations: authData?.organizations ?? [],
    activeOrganization,
    setAuthData,
    setActiveOrganization,
    signOut,
  };
}