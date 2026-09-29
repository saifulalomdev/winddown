// src/features/auth/auth-client.ts
import { SecureStorage } from '@aparajita/capacitor-secure-storage';
import { organizationClient } from 'better-auth/client/plugins';
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  plugins: [
    organizationClient(),
  ],
  fetchOptions: {
    onRequest: async (req) => {
      const token = await SecureStorage.get('session_token');
      if (token) {
        req.headers.set("Authorization", `Bearer ${token}`);
      }
    },
    onSuccess: async (ctx) => {
      const token = (ctx.data as any)?.token;
      if (token) {
        await SecureStorage.set('session_token', token);
      }
    }
  }
});