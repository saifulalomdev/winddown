import { useEffect, useState } from "react";
import type { Session, User } from "./auth-types";
import { authClient } from "./auth-client";

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        setIsLoading(true);

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

  const signOut = async () => {
    try {
      await authClient.signOut();
    } catch {
      // Handle sign-out error if needed
    } finally {
      setUser(null);
      setSession(null);
    }
  };

  return { isLoading, user, session, signOut };
}