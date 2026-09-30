CREATE TABLE IF NOT EXISTS `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`sku` text,
	`distributor_price` real NOT NULL,
	`shop_price` real NOT NULL,
	`mrp` real,
	`unit` text DEFAULT 'pack' NOT NULL,
	`images` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `products_sku_unique` ON `products` (`sku`);