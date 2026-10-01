import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/components/cart-context";
import { AppAlert } from "@/components/app-alert";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Package,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const navigate = useNavigate();
  const [note, setNote] = useState("");
  const [isClearCartOpen, setIsClearCartOpen] = useState(false);

  const itemList = Object.values(items);

  const handleConfirmOrder = () => {
    // Navigate to checkout or process order internally
    navigate("/checkout", { state: { note } });
  };

  const handleClearCart = () => {
    clearCart();
    setIsClearCartOpen(false);
  };

  return (
    <>
      {/* Top Header */}
      <Header>
        <div className="flex items-center gap-2">
          <ArrowLeft
            onClick={() => navigate(-1)}
            className="shrink-0 -ml-2"
            aria-label="Go back"
            size={28}
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Order Cart</h1>
            <p className="text-xs text-muted-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"} selected
            </p>
          </div>
        </div>

        {itemList.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsClearCartOpen(true)}
            className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            Clear All
          </Button>
        )}
      </Header>

      <div className="flex flex-col min-h-screen bg-background">
        {/* Main Content Area */}
        <main className="flex-1 p-3 pt-16 max-w-md mx-auto w-full space-y-3">
          {itemList.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center border border-border">
                <ShoppingBag className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">
                  Your cart is empty
                </h3>
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  Add products from the catalog to build an order.
                </p>
              </div>
              <Button
                onClick={() => navigate("/products")}
                size="sm"
                className="mt-2 text-xs"
              >
                Browse Products
              </Button>
            </div>
          ) : (
            /* Cart Item List */
            <div className="space-y-2.5">
              {itemList.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-stretch gap-3 p-2.5 rounded-xl border border-border bg-card shadow-sm"
                >
                  {/* Product Image */}
                  <div className="w-16 h-16 shrink-0 aspect-square rounded-lg bg-muted flex items-center justify-center border border-border/50 overflow-hidden self-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-muted-foreground/50" />
                    )}
                  </div>

                  {/* Details & Actions */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">
                          SKU: {product.sku}
                        </span>
                        <h4 className="text-xs font-semibold text-foreground leading-snug line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-xs font-bold text-primary mt-0.5">
                          ৳{product.shopPrice.toLocaleString()} / {product.unit}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(product.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Quantity Controller & Subtotal */}
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/40">
                      <div className="flex items-center gap-1.5 bg-muted/60 border border-border/60 rounded-lg p-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                          }
                          className="h-6 w-6 rounded-md hover:bg-background"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="text-xs font-bold text-foreground px-1 min-w-[20px] text-center">
                          {quantity}
                        </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                          className="h-6 w-6 rounded-md hover:bg-background"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <p className="text-xs font-bold text-foreground">
                        ৳{(product.shopPrice * quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Optional Note Card */}
              <div className="p-3 rounded-xl border border-border bg-card shadow-sm space-y-2 mt-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Order Notes</span>
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add delivery instructions or special requests..."
                  className="w-full text-xs p-2.5 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px]"
                />
              </div>

              {/* Price Summary Breakdown */}
              <div className="p-3.5 rounded-xl border border-border bg-card shadow-sm space-y-2">
                <h4 className="text-xs font-semibold text-foreground mb-1">
                  Bill Summary
                </h4>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>৳{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Delivery / Tax</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between text-sm font-bold text-foreground">
                  <span>Total Amount</span>
                  <span className="text-primary">
                    ৳{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Sticky Bottom Confirm Order Button */}
        {itemList.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t border-border shadow-lg z-20">
            <div className="max-w-md mx-auto flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase font-mono text-muted-foreground">
                  Total payable
                </p>
                <p className="text-lg font-bold text-primary leading-tight">
                  ৳{totalPrice.toLocaleString()}
                </p>
              </div>

              <Button onClick={handleConfirmOrder} size="sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Confirm Order</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Clear Cart Confirmation Dialog */}
      <AppAlert
        isOpen={isClearCartOpen}
        onClose={() => setIsClearCartOpen(false)}
        onConfirm={handleClearCart}
        title="Clear your cart?"
        cancelLabel="Keep Items"
        confirmLabel="Clear All"
        description="Are you sure you want to remove all items from your cart? This action cannot be undone."
      />
    </>
  );
}