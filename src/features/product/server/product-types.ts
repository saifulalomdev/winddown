import { z } from "zod";
import { products } from "./product-table"; // Adjust path to your table file
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  productSelectSchema,
} from "./product-schema";

// Direct Drizzle Inferred Types
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

// Zod Inferred Schemas
export type ProductSelect = z.infer<typeof productSelectSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryParams = z.infer<typeof productQuerySchema>;