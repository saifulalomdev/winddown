// src/features/product/server/__tests__/product-repository.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ProductRepository } from "../product-repository";
import { createTestDb } from "@/tests/setup-db";
import type { DBInstance } from "@/db/client";
import type Database from "better-sqlite3";

describe("ProductRepository Integration Tests", () => {
  let db: DBInstance;
  let sqlite: Database.Database;
  let repository: ProductRepository;

  // Helper function for quick test inputs
  const defaultInput = {
    unit: "pc",
    isActive: true,
  };

  beforeEach(() => {
    const testDb = createTestDb();
    db = testDb.db as unknown as DBInstance;
    sqlite = testDb.sqlite;
    repository = new ProductRepository(db);
  });

  afterEach(() => {
    sqlite.close();
  });

  it("should create a new product successfully", async () => {
    const input = {
      name: "Super Juice",
      sku: "SKU-1001",
      distributorPrice: 50,
      shopPrice: 65,
      mrp: 70,
      ...defaultInput,
    };

    const created = await repository.create(input);

    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.name).toBe("Super Juice");
    expect(created.shopPrice).toBe(65);
  });

  it("should find a product by ID", async () => {
    const created = await repository.create({
      name: "Fresh Milk",
      distributorPrice: 30,
      shopPrice: 40,
      ...defaultInput,
    });

    const found = await repository.findById(created.id);

    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe("Fresh Milk");
  });

  it("should return undefined when finding by a non-existent ID", async () => {
    const found = await repository.findById("non-existent-id");
    expect(found).toBeUndefined();
  });

  it("should find a product by SKU", async () => {
    const created = await repository.create({
      name: "Energy Drink",
      sku: "SKU-BAR-999",
      distributorPrice: 80,
      shopPrice: 100,
      ...defaultInput,
    });

    const found = await repository.findBySku("SKU-BAR-999");

    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe("Energy Drink");
  });

  it("should update product details by ID", async () => {
    const created = await repository.create({
      name: "Old Product Name",
      distributorPrice: 20,
      shopPrice: 25,
      ...defaultInput,
    });

    const updated = await repository.updateById(created.id, {
      name: "New Product Name",
      shopPrice: 30,
    });

    expect(updated).toBeDefined();
    expect(updated?.name).toBe("New Product Name");
    expect(updated?.shopPrice).toBe(30);
  });

  it("should delete a product by ID", async () => {
    const created = await repository.create({
      name: "Item to Delete",
      distributorPrice: 10,
      shopPrice: 15,
      ...defaultInput,
    });

    const isDeleted = await repository.deleteById(created.id);
    const found = await repository.findById(created.id);

    expect(isDeleted).toBe(true);
    expect(found).toBeUndefined();
  });

  it("should list products with search filter and pagination", async () => {
    await repository.create({
      name: "Mango Biscuits",
      distributorPrice: 10,
      shopPrice: 15,
      ...defaultInput,
    });

    await repository.create({
      name: "Mango Juice",
      distributorPrice: 20,
      shopPrice: 30,
      ...defaultInput,
    });

    await repository.create({
      name: "Chocolate Bar",
      distributorPrice: 5,
      shopPrice: 10,
      ...defaultInput,
    });

    const searchResult = await repository.list({
      page: 1,
      limit: 10,
      search: "Mango",
      sortBy: "name",
      sortOrder: "asc",
    });

    expect(searchResult.items.length).toBe(2);
    expect(searchResult.pagination.total).toBe(2);

    const paginatedResult = await repository.list({
      page: 1,
      limit: 2,
      sortBy: "name",
      sortOrder: "asc",
    });

    expect(paginatedResult.items.length).toBe(2);
    expect(paginatedResult.pagination.total).toBe(3);
    expect(paginatedResult.pagination.totalPages).toBe(2);
  });
});