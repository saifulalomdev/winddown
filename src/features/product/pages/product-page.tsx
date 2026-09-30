import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, ShoppingBag, Edit2, Trash2, Package } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import { ProductForm } from '@/features/product/components/product-form';
import { createProductSchema } from '@/features/product/server/product-schema';
import type {
  CreateProductInput,
  ProductSelect,
} from '@/features/product/server/product-types';

import { initDb, type DBInstance } from '@/db/client';
import { ProductRepository } from '@/features/product/server/product-repository';

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

  // 1. Initialize Capacitor SQLite & ProductRepository instance
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

  // Open drawer pre-filled for editing an existing product
  const handleOpenEdit = (product: ProductSelect) => {
    setSelectedProduct(product);
    form.reset({
      name: product.name,
      sku: product.sku ?? '',
      distributorPrice: product.distributorPrice,
      shopPrice: product.shopPrice,
      mrp: product.mrp ?? undefined,
      unit: product.unit,
      images: product.images ?? [],
      isActive: product.isActive,
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

  // Delete product by ID
  const handleDelete = async (id: string) => {
    if (!repository) return;
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await repository.deleteById(id);
      await loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <>
      <Header className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">Products</h1>

          <div className="flex gap-3 items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleOpenCreate}
              className="shrink-0"
            >
              <PlusIcon size={20} />
            </Button>

            <Button variant="outline" size="icon" className="shrink-0">
              <ShoppingBag size={20} />
            </Button>
          </div>
        </div>
      </Header>

      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Product List */}
        <div className="space-y-3">
          {products.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground border rounded-lg">
              No products found. Tap "+" to add one!
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-card"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-3">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded-md border"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-md border flex items-center justify-center bg-muted text-muted-foreground">
                      <Package size={20} />
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-sm">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Shop: Tk {product.shopPrice} | Cost: Tk {product.distributorPrice} / {product.unit}
                    </p>
                    {product.sku && (
                      <p className="text-[10px] text-muted-foreground">
                        SKU: {product.sku}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenEdit(product)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Shared Drawer for Create / Edit */}
      <Drawer open={isOpen} direction='right' onOpenChange={setIsOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>
              {selectedProduct ? 'Edit Product' : 'Create New Product'}
            </DrawerTitle>
            <DrawerDescription>
              {selectedProduct
                ? 'Update product details and pricing.'
                : 'Add product details and upload sample images.'}
            </DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto px-4 pb-6">
            <ProductForm
              form={form}
              onSubmit={handleSubmit}
              onCancel={() => setIsOpen(false)}
              isLoading={isLoading}
              submitLabel={selectedProduct ? 'Update Product' : 'Save Product'}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}