import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';

import { ProductForm } from '@/features/product/components/product-form';
import { createProductSchema } from '@/features/product/server/product-schema';
import type {
  CreateProductInput,
  ProductSelect,
} from '@/features/product/server/product-types';

import { initDb, type DBInstance } from '@/db/client';
import { ProductRepository } from '@/features/product/server/product-repository';
import { AppSheet } from '@/components/app-sheet';
import { ProductList } from '../components/product-list';
import ProductPageHeader from '../components/product-page-header';

export default function ProductPage() {
  const [repository, setRepository] = useState<ProductRepository | null>(null);
  const [products, setProducts] = useState<ProductSelect[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductSelect | null>(null);
  // Initialize React Hook Form
  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema) as any,
    defaultValues: {
      name: '',
      sku: '',
      distributorPrice: 0,
      shopPrice: 0,
      mrp: undefined,
      unit: 'pack',
      images: [],
      isActive: true,
    },
  });

  useEffect(() => {
    let isMounted = true;

    async function setupRepository() {
      try {
        const db: DBInstance = await initDb();
        if (isMounted) {
          setRepository(new ProductRepository(db));
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    }

    setupRepository();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch product list from local SQLite database
  const loadProducts = useCallback(async () => {
    if (!repository) return;

    try {
      const result = await repository.list({
        page: 1,
        limit: 50,
        search: search.trim() || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      setProducts(result.items);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }, [repository, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Open drawer for creating a new product
  const handleOpenCreate = () => {
    setSelectedProduct(null);
    form.reset({
      name: '',
      sku: '',
      distributorPrice: 0,
      shopPrice: 0,
      mrp: undefined,
      unit: 'pack',
      images: [],
      isActive: true,
    });
    setIsOpen(true);
  };


  // Save changes (Create or Update)
  const handleSubmit = async (data: CreateProductInput) => {
    if (!repository) return;

    try {
      setIsLoading(true);

      if (selectedProduct) {
        // Update existing product
        await repository.updateById(selectedProduct.id, data);
      } else {
        // Create new product
        await repository.create(data);
      }

      setIsOpen(false);
      await loadProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ProductPageHeader onClick={handleOpenCreate} />

      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ProductList products={products as any} />
      <AppSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        description={selectedProduct
          ? 'Update product details and pricing.'
          : 'Add product details and upload sample images.'}
        title={selectedProduct ? 'Update product' : 'Add new product'}
      >
        <ProductForm
          form={form}
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
          isLoading={isLoading}
          submitLabel={selectedProduct ? 'Update Product' : 'Save Product'}
        />
      </AppSheet>
    </>
  );
}