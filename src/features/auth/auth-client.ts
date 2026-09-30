// src/features/auth/auth-client.ts
import { organizationClient } from 'better-auth/client/plugins';
import { createAuthClient } from "better-auth/react";
import { Storage } from '@/utils/storage-helper';

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  plugins: [
    organizationClient(),
  ],
  fetchOptions: {
    onRequest: async (req) => {
      try {
        // Read token securely using Storage
        const token = await Storage.get<string>('session_token', { secure: true });

        if (token) {
          req.headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (error) {
        console.error("Error reading token from secure storage:", error);
      }
    },
    onSuccess: async (ctx) => {
      try {
        // Extract token safely from response data or response headers
        const token = (ctx.data as any)?.token || (ctx.data as any)?.session?.token;

        if (token) {
          // Save token securely using Storage
          await Storage.set('session_token', token, { secure: true });
        }
      } catch (error) {
        console.error("Error writing token to secure storage:", error);
      }
    }
  }
});