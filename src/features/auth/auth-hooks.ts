// import * as SecureStore from "expo-secure-store";
import { useEffect, useState, useCallback } from "react";
import { authClient } from "./auth-client";

// const CACHED_USER_KEY = "offline_user_session";

export function useAuthState() {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  const initAuth = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data, error } = await authClient.getSession()
      console.log(data, error);
      setIsLoading(false);

      try {

      } catch {
        setIsOffline(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const signOut = async () => {
    try {
      await authClient.signOut();
    } catch {

    } finally {
      setUser(null);
    }
  };

  return { isLoading, user, isOffline, signOut, refetchSession: initAuth };
}