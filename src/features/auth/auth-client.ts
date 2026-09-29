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
      console.log("request", req)
      try {
        const token = await SecureStorage.get('session_token');

        // Ensure token is a non-empty string before setting header
        if (token && typeof token === 'string') {
          req.headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (error) {
        console.error("Error reading token from SecureStorage:", error);
      }
    },
    onSuccess: async (ctx) => {
      console.log("onSucces", ctx)
      try {
        // Extract token safely from response data or response headers
        const token = (ctx.data as any)?.token || (ctx.data as any)?.session?.token;

        if (token && typeof token === 'string') {
          await SecureStorage.set('session_token', token);
        }
      } catch (error) {
        console.error("Error writing token to SecureStorage:", error);
      }
    }
  }
});