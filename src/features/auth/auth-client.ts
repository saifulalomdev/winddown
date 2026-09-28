// src/features/auth/auth-client.ts
import { organizationClient } from 'better-auth/client/plugins';
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: import.meta.env.EXPO_PUBLIC_API_URL,
        
    plugins: [
        organizationClient(),
    ]
});