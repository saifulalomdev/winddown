import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),

  // Basic Details
  name: text('name').notNull(),
  sku: text('sku').unique(), // Barcode or product code

  // Pricing (Stored as REAL or cents/paisa INTEGER to avoid floating point issues)
  distributorPrice: real('distributor_price').notNull(), // Cost price from company
  shopPrice: real('shop_price').notNull(), // Selling price to shop owner (Trade Price)
  mrp: real('mrp'), // Maximum Retail Price (Printed on package)

  // Stock Management (Crucial for Manager Stock Review)
  unit: text('unit').notNull().default('pack'), // e.g., 'pack', 'case', 'box', 'piece'

  // Media
  images: text('images', { mode: 'json' }).$type<string[]>(), // Array of image URLs/paths

  // Status & Offline Sync
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});