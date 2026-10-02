import type { BaseUser, BaseSession } from "better-auth/client";
import type { Organization } from "better-auth/client/plugins";

export interface Session extends BaseSession {
  activeOrganizationId?: string | null | undefined;
}

export interface AuthData {
  user: BaseUser;
  session: Session;
  organizations: Organization[];
  activeOrganizationId?: string | null;
}

export interface AuthContextType {
  user: BaseUser | null;
  session: Session | null;
  organizations: Organization[];
  activeOrganization: Organization | null;
  isLoading: boolean;
  isLoggingOut: boolean;
  setAuthData: (data: AuthData | null) => void;
  setActiveOrganization: (orgId: string) => Promise<void>;
  signOut: () => Promise<void>;
}