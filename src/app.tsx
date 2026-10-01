import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, AuthGuard, AuthIndex } from './features/auth';
import { TabLayout } from './layouts/layout-tab';
import { BaseLayout } from './layouts/layout-base';
import { SettingsPage } from './features/settings/pages/settings-page';
import { DashboardPage } from './features/dashboard/pages/dashboard-page';
import { useEffect, useState } from 'react';
import { initI18n } from './lib/i18n';
import { ThemeProvider } from './components/theme-provider';
import ProductPage from './features/product/pages/product-page';
import { ShopPage } from './features/shop/pages/shop-page';
import { OrderPage } from './features/order/pages/order-page';
import { CartProvider } from './features/cart/components/cart-context';
import { CartPage } from './features/cart/pages/cart-page';
import { CapacitorBackButton } from './components/back-button';

export default function App() {
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    initI18n().then(() => setIsI18nReady(true));
  }, []);

  if (!isI18nReady) {
    return null; // Or a loading spinner
  }

  return (
    <BrowserRouter>
      <CapacitorBackButton/>

      <ThemeProvider defaultTheme="system" storageKey="user_theme">
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route element={<AuthGuard />}>
                <Route element={<BaseLayout />}>
                  <Route path="/" element={<TabLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="products" element={<ProductPage />} />
                    <Route path="orders" element={<OrderPage />} />
                    <Route path="outlets" element={<ShopPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>
                  <Route path="cart" element={<CartPage />} />
                  <Route path="auth" element={<AuthIndex />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}