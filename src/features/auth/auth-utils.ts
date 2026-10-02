import { authClient } from "./auth-client";
import type { AuthData, CachedOrganization } from "./auth-types";

export async function fetchFreshAuthData(): Promise<AuthData | null> {
  // 1. Fetch core session and the base organization records concurrently
  const [{ data: sessionData }, { data: orgsData }] = await Promise.all([
    authClient.getSession(),
    authClient.organization.list(),
  ]);

  if (!sessionData || !sessionData.user) return null;

  const baseOrganizations = orgsData || [];
  const detailedOrganizations: CachedOrganization[] = [];

  // 2. Concurrently fetch only the current user's role for each associated organization
  if (baseOrganizations.length > 0) {
    const rolePromises = baseOrganizations.map(async (org) => {
      // FIX: Use getActiveMember instead of getActiveMemberOfOrganization
      const { data: memberContext } = await authClient.organization.getActiveMember({
        query: { organizationId: org.id }
      });
      
      return {
        ...org,
        // Fallback to 'member' if the record is somehow undefined
        role: memberContext?.role || "member", 
      };
    });

    const resolvedOrgs = await Promise.all(rolePromises);
    detailedOrganizations.push(...resolvedOrgs);
  }

  return {
    user: sessionData.user,
    session: sessionData.session,
    organizations: detailedOrganizations, 
    activeOrganizationId: sessionData.session.activeOrganizationId || null
  };
}
