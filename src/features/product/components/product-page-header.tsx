// src/features/product/components/product-page-header.tsx
import { useCart } from "@/features/cart/components/cart-context";
import { PlusIcon, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Link } from "react-router-dom";

export default function ProductPageHeader({ onClick }: { onClick?: () => void }) {
  const { totalItems } = useCart();

  return (
    <Header>
      <h1 className="text-xl font-bold tracking-tight">Products</h1>

      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={onClick}
          className="shrink-0"
          aria-label="Add product"
        >
          <PlusIcon className="h-5 w-5" />
        </Button>

        <Link to="/cart">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 relative"
            aria-label="View cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 size-6 px-1 rounded-full bg-destructive text-primary-foreground text-[10px] font-bold flex items-center justify-center border-2 border-background animate-in zoom-in-50">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </Header>
  );
}