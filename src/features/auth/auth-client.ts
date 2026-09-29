// src/features/auth/auth-client.ts
import { SecureStorage } from '@aparajita/capacitor-secure-storage';
import { organizationClient } from 'better-auth/client/plugins';
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://192.168.0.101:8787",
  plugins: [
    organizationClient(),
  ],
  fetchOptions: {
    onRequest: async (req) => {
      // 1. Get the saved token from secure storage
      const token = await SecureStorage.get('session_token');

      // 2. If token exists, attach it to the Authorization header
      if (token) {
        req.headers.set("Authorization", `Bearer ${token}`);
      }
    },
    onSuccess: async (ctx) => {
      const token = (ctx.data as any)?.token;

      if (token) {
        // Save the token using positional arguments (key, data)
        await SecureStorage.set('session_token', token);
      }
    }
  }
});