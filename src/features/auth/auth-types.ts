import type { BaseUser, BaseSession } from "better-auth/client";
import type { Organization } from "better-auth/client/plugins";

// 1. CREATE A CUSTOM EXTENDED INTERFACE FOR OFFLINE CACHING
export interface CachedOrganization extends Organization {
  // Explicitly bundle the user's role string inside this organization 
  role: "owner" | "admin" | "member" | string;
}

export interface Session extends BaseSession {
  activeOrganizationId?: string | null | undefined;
}

// 2. UPDATE AUTHDATA TO USE THE CUSTOM EXTENDED INTERFACE
export interface AuthData {
  user: BaseUser;
  session: Session;
  organizations: CachedOrganization[];
  activeOrganizationId?: string | null;
}

// 3. UPDATE AUTHCONTEXTTYPE TO DISPATCH THE NEW DATA STRUCTURE
export interface AuthContextType {
  user: BaseUser | null;
  session: Session | null;
  organizations: CachedOrganization[]; // Changed from Organization[]
  activeOrganization: CachedOrganization | null; // Changed from Organization | null
  isLoading: boolean;
  isLoggingOut: boolean;
  setAuthData: (data: AuthData | null) => void;
  setActiveOrganization: (orgId: string) => Promise<void>;
  signOut: () => Promise<void>;
}
