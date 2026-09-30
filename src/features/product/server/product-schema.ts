import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { products } from "./product-table"; 

// Field Schemas
export const productIdSchema = z
  .string("Product ID is required")
  .trim()
  .min(1, "Product ID cannot be empty");

export const productSkuSchema = z
  .string()
  .trim()
  .min(1, "SKU cannot be empty")
  .optional()
  .nullable();

// Base Insert Schema from Drizzle Table
export const baseProductSchema = createInsertSchema(products, {
  id: productIdSchema,
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  sku: productSkuSchema,
  distributorPrice: z.number().nonnegative("Distributor price cannot be negative"),
  shopPrice: z.number().nonnegative("Shop price cannot be negative"),
  mrp: z.number().nonnegative("MRP cannot be negative").optional().nullable(),
  unit: z.string().trim().min(1, "Unit is required").default("pack"),
  images: z.array(z.string()).optional().nullable(),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Select Schema
export const productSelectSchema = createSelectSchema(products, {
  images: z.array(z.string()).nullable(),
});

// Input Mutation Schemas
export const createProductSchema = baseProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProductSchema = createProductSchema.partial();

// Query / Filter Schema for Local SQLite operations
export const productQuerySchema = z.object({
  search: z.string().trim().optional(),
  unit: z.string().trim().optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z
    .enum(["name", "distributorPrice", "shopPrice", "createdAt", "updatedAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});