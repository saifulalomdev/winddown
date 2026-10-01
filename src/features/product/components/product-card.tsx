// src/features/product/components/product-card.tsx
import { useState, useEffect } from "react";
import { Plus, Minus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/input";

export interface Product {
  id: string;
  name: string;
  sku: string;
  distributorPrice: number;
  shopPrice: number;
  mrp?: number;
  unit: string;
  stock?: number;
  image?: string;
  images?: string[];
}

interface ProductCardProps {
  product: Product;
  initialQuantity?: number;
  onQuantityChange: (productId: string, newQuantity: number) => void;
}

export function ProductCard({
  product,
  initialQuantity = 0,
  onQuantityChange,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(initialQuantity));

  // Missing stock = unlimited
  const maxStock = product.stock ?? Infinity;

  useEffect(() => {
    setQuantity(initialQuantity);
    if (!isEditing) {
      setInputValue(String(initialQuantity));
    }
  }, [initialQuantity, isEditing]);

  const commitQuantity = (val: number) => {
    const validQty = Math.max(0, Math.min(val, maxStock));
    setQuantity(validQty);
    setInputValue(String(validQty));
    onQuantityChange(product.id, validQty);
  };

  const handleIncrement = () => {
    commitQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    commitQuantity(quantity - 1);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed) || parsed <= 0) {
      commitQuantity(0);
    } else {
      commitQuantity(parsed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  const isSelected = quantity > 0;
  const productImage = product.image || (product.images && product.images[0]);

  return (
    <div
      className={cn(
        "relative flex items-stretch gap-3 p-2.5 rounded-xl border bg-card text-card-foreground transition-all shadow-sm",
        isSelected
          ? "border-primary ring-1 ring-primary/20 bg-primary/5"
          : "border-border"
      )}
    >
      {/* Left: Square Product Image */}
      <div className="w-24 shrink-0 aspect-square rounded-lg bg-muted flex items-center justify-center border border-border/50 overflow-hidden self-stretch">
        {productImage ? (
          <img
            src={productImage}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package className="h-8 w-8 text-muted-foreground/50" />
        )}
      </div>

      {/* Right: Info + Action Button */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">
              SKU: {product.sku}
            </span>
            <span
              className={cn(
                "inline-block w-2 h-2 rounded-full",
                maxStock > 0 ? "bg-emerald-500" : "bg-destructive"
              )}
            />
          </div>

          <h4 className="text-xs font-semibold text-foreground leading-snug mt-0.5 whitespace-normal break-words">
            {product.name}
          </h4>

          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-primary">
              ৳{product.shopPrice.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground">
              / {product.unit}
            </span>
            {product.mrp && (
              <span className="text-[10px] text-muted-foreground line-through">
                ৳{product.mrp}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full mt-2">
          {!isSelected ? (
            <Button
              onClick={handleIncrement}
              disabled={maxStock <= 0}
              size="xs"
              className="w-full text-xs font-medium"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center justify-between bg-background border border-primary/30 rounded-full shadow-sm overflow-hidden">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleDecrement}
                aria-label="Decrease quantity"
              >
                <Minus/>
              </Button>

              <div className="flex items-center justify-center flex-1 px-1">
                {isEditing ? (
                  <Input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="w-12 h-6 text-center text-xs font-bold text-foreground bg-accent/30 rounded border border-primary focus:outline-none p-0"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(true);
                      setInputValue(String(quantity));
                    }}
                    className="text-xs font-bold text-foreground hover:bg-muted/50 px-2 py-0.5 rounded transition-colors"
                  >
                    {quantity} {product.unit}
                  </button>
                )}
              </div>

              <Button
                size="icon-xs"
                onClick={handleIncrement}
                aria-label="Increase quantity"
              >
                <Plus />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}