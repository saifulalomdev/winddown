import {  useEffect, useState } from "react";
import type { Session, User } from "./auth-types";
import { authClient } from "./auth-client";

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load check
  useEffect(() => {
    async function initAuth() {
      try {
        const { data } = await authClient.getSession();
        if (data) {
          setUser(data.user);
          setSession(data.session);
        } else {
          setUser(null);
          setSession(null);
        }
      } catch {
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const setAuthData = (data: { user: User; session: Session } | null) => {
    if (data) {
      setUser(data.user);
      setSession(data.session);
    } else {
      setUser(null);
      setSession(null);
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
    } catch {
    } finally {
      setUser(null);
      setSession(null);
    }
  };

  return { isLoading, user, session, setAuthData, signOut };
}