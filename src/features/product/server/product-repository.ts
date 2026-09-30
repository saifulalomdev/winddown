// src/features/product/server/product-repository.ts
import { eq, count, like, asc, desc, SQL } from "drizzle-orm";
import { products } from "./product-table";
import type { DBInstance } from "@/db/client";
import type {
    ProductSelect,
    ProductQueryParams,
    CreateProductInput,
    UpdateProductInput,
} from "./product-types";

export class ProductRepository {
    private db: DBInstance;

    constructor(db: DBInstance) {
        this.db = db;
    }
    // Create a new product
    async create(data: CreateProductInput): Promise<ProductSelect> {
        const [result] = await this.db
            .insert(products)
            .values(data)
            .returning();
        return result;
    }

    // Find a product by its ID
    async findById(id: string): Promise<ProductSelect | undefined> {
        const [result] = await this.db
            .select()
            .from(products)
            .where(eq(products.id, id));
        return result;
    }

    // Find a product by its SKU
    async findBySku(sku: string): Promise<ProductSelect | undefined> {
        const [result] = await this.db
            .select()
            .from(products)
            .where(eq(products.sku, sku));
        return result;
    }

    // Update a product by its ID
    async updateById(
        id: string,
        data: UpdateProductInput
    ): Promise<ProductSelect | undefined> {
        const [result] = await this.db
            .update(products)
            .set({
                ...data,
                updatedAt: new Date(), // Updates the timestamp
            })
            .where(eq(products.id, id))
            .returning();
        return result;
    }

    // Delete a product by its ID
    async deleteById(id: string): Promise<boolean> {
        const result = await this.db
            .delete(products)
            .where(eq(products.id, id))
            .returning();
        return result.length > 0;
    }

    // Get a list of products with pagination and search
    async list(query: ProductQueryParams) {
        const { page, limit, search, sortBy, sortOrder } = query;
        const offset = (page - 1) * limit;

        // Search filter by product name
        const whereClause: SQL | undefined = search
            ? like(products.name, `%${search}%`)
            : undefined;

        // Map sortBy string to Drizzle column schema
        const getSortColumn = (key: ProductQueryParams["sortBy"]) => {
            switch (key) {
                case "name":
                    return products.name;
                case "shopPrice":
                    return products.shopPrice;
                case "updatedAt":
                    return products.updatedAt;
                case "createdAt":
                default:
                    return products.createdAt;
            }
        };

        const sortColumn = getSortColumn(sortBy);
        const orderByClause =
            sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

        // Fetch data and total count together
        const [data, [{ total }]] = await Promise.all([
            this.db
                .select()
                .from(products)
                .where(whereClause)
                .orderBy(orderByClause)
                .limit(limit)
                .offset(offset),
            this.db
                .select({ total: count() })
                .from(products)
                .where(whereClause),
        ]);

        return {
            items: data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
}