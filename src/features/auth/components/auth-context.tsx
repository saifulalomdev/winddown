import React, { createContext, useContext } from "react";
import { useAuthState } from "../auth-hooks";

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  isOffline: boolean;
  signOut: () => Promise<void>;
  refetchSession: () => Promise<void>;
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