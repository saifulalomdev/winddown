import { useEffect, useState, useCallback } from "react";
import type { Session, User } from "./auth-types";
import { authClient } from "./auth-client";
import { Storage } from "@/utils/storage-helper";
import { Network } from "@capacitor/network";

const AUTH_CACHE_KEY = "cached_auth_data";

interface AuthData {
  user: User;
  session: Session;
}

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to sync React state and persistent storage
  const setAuthData = useCallback((data: AuthData | null) => {
    if (data) {
      setUser(data.user);
      setSession(data.session);
      Storage.set(AUTH_CACHE_KEY, data).catch((err) =>
        console.error("Failed to cache auth data:", err)
      );
    } else {
      setUser(null);
      setSession(null);
      Storage.delete(AUTH_CACHE_KEY).catch((err) =>
        console.error("Failed to remove cached auth data:", err)
      );
    }
  }, []);

  useEffect(() => {
    async function initAuth() {
      setIsLoading(true);

      // 1. Always load offline session from storage first
      let localAuth: AuthData | null = null;
      try {
        localAuth = await Storage.get<AuthData>(AUTH_CACHE_KEY);
        if (localAuth?.user && localAuth?.session) {
          setUser(localAuth.user);
          setSession(localAuth.session);
        }
      } catch (err) {
        console.error("Failed to read cached auth session:", err);
      }

      // 2. Check native network status on Android
      const status = await Network.getStatus();

      if (status.connected) {
        try {
          const res = await authClient.getSession();

          if (res?.data) {
            // Fresh session from server
            setAuthData({
              user: res.data.user,
              session: res.data.session,
            });
          } else {
            // Token is invalid/expired on server
            setAuthData(null);
          }
        } catch (error) {
          console.warn("Session refresh failed online:", error);

          // If server is unreachable, stick with local offline session
          if (localAuth) {
            setUser(localAuth.user);
            setSession(localAuth.session);
          } else {
            setAuthData(null);
          }
        }
      } else {
        // 3. Device is offline: keep local session if present
        if (!localAuth) {
          setAuthData(null);
        }
      }

      setIsLoading(false);
    }

    initAuth();
  }, [setAuthData]);

  const signOut = async () => {
    try {
      setIsLoading(true)
      const status = await Network.getStatus();
      if (status.connected) {
        await authClient.signOut();
      }
    } catch (err) {
      console.error("Remote sign out failed:", err);
    } finally {
      // Clear offline storage and reset state
      setAuthData(null);
      setIsLoading(false)
    }
  };

  return { isLoading, user, session, setAuthData, signOut };
}