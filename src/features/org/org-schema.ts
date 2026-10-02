import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, 'Agency or Route name must be at least 2 characters')
    .max(50, 'Name must be under 50 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  logo: z.string().optional(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;