// src/features/product/components/product-list.tsx
import { ProductCard, type Product } from "./product-card";
import { useCart } from "@/features/cart/components/cart-context";

interface ProductListProps {
  products: Product[];
  onOrderSubmit?: () => void;
}

export function ProductList({ products }: ProductListProps) {
  const { items, updateQuantity, addItem } = useCart();

  const handleQuantityChange = (product: Product, targetQuantity: number) => {
    if (targetQuantity <= 0) {
      updateQuantity(product.id, 0);
    } else if (items[product.id]) {
      updateQuantity(product.id, targetQuantity);
    } else {
      addItem(product, targetQuantity);
    }
  };

  return (
    <div className="flex flex-col pb-20">
      <div className="flex-1 overflow-y-auto space-y-2.5 p-0.5">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              initialQuantity={items[product.id]?.quantity || 0}
              onQuantityChange={(_, newQty) =>
                handleQuantityChange(product, newQty)
              }
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <p className="text-sm">No products available</p>
          </div>
        )}
      </div>
    </div>
  );
}