// src/features/auth/auth-client.ts
import { organizationClient } from 'better-auth/client/plugins';
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://192.168.0.101:3000",
  plugins: [
    organizationClient(),
  ],
});