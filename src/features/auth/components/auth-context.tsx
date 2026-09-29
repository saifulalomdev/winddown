import React, { createContext, useContext } from "react";
import type { Session, User } from "../auth-types";
import { useAuthState } from "../auth-hooks";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  session: Session | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const authState = useAuthState();

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);