// src/features/cart/components/cart-context.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Storage } from "@/utils/storage-helper";
import type { Product } from "@/features/product/components/product-card";

const CART_STORAGE_KEY = "app_sales_cart";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: Record<string, CartItem>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Record<string, CartItem>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load saved cart from Capacitor Storage on app launch
  useEffect(() => {
    async function loadStoredCart() {
      try {
        const savedCart = await Storage.get<Record<string, CartItem>>(
          CART_STORAGE_KEY
        );
        if (savedCart) {
          setItems(savedCart);
        }
      } catch (error) {
        console.error("Failed to load cart from storage:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredCart();
  }, []);

  // Save cart to Capacitor Storage whenever items state changes
  const saveCart = useCallback(async (updatedItems: Record<string, CartItem>) => {
    try {
      await Storage.set(CART_STORAGE_KEY, updatedItems);
    } catch (error) {
      console.error("Failed to persist cart to storage:", error);
    }
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setItems((prev) => {
        const next = { ...prev };

        if (quantity <= 0) {
          delete next[productId];
        } else if (next[productId]) {
          next[productId] = {
            ...next[productId],
            quantity,
          };
        }

        saveCart(next);
        return next;
      });
    },
    [saveCart]
  );

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      setItems((prev) => {
        const currentQty = prev[product.id]?.quantity || 0;
        const newQty = currentQty + quantity;

        const next = {
          ...prev,
          [product.id]: {
            product,
            quantity: newQty,
          },
        };

        saveCart(next);
        return next;
      });
    },
    [saveCart]
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const next = { ...prev };
        delete next[productId];
        saveCart(next);
        return next;
      });
    },
    [saveCart]
  );

  const clearCart = useCallback(async () => {
    setItems({});
    await Storage.delete(CART_STORAGE_KEY);
  }, []);

  // Compute totals
  const { totalItems, totalPrice } = useMemo(() => {
    let count = 0;
    let price = 0;

    Object.values(items).forEach(({ product, quantity }) => {
      count += quantity;
      price += product.shopPrice * quantity;
    });

    return { totalItems: count, totalPrice: price };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalPrice,
      isLoading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      totalItems,
      totalPrice,
      isLoading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to consume the Cart Context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}