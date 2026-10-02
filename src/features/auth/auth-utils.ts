import { authClient } from "./auth-client";
import type { AuthData } from "./auth-types";

export async function fetchFreshAuthData(): Promise<AuthData | null> {
  const [{ data: sessionData }, { data: orgsData }] = await Promise.all([
    authClient.getSession(),
    authClient.organization.list(),
  ]);

  if (!sessionData) return null;

  return {
    user: sessionData.user,
    session: sessionData.session,
    organizations: orgsData || [],
  };
}