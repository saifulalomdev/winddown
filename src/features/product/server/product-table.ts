import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { v4 as uuidv4 } from 'uuid';

export const products = sqliteTable('products', {
  // Generate random UUID automatically
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),

  name: text('name').notNull(),
  sku: text('sku').unique(),
  distributorPrice: real('distributor_price').notNull(),
  shopPrice: real('shop_price').notNull(),
  mrp: real('mrp'),
  unit: text('unit').notNull().default('pack'),
  images: text('images', { mode: 'json' }).$type<string[]>(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),

  // Automatically set current timestamp on insert
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),

  // Automatically set current timestamp on insert
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});