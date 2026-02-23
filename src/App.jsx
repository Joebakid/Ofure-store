import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import AdminProducts from "./admin/pages/AdminProducts";
import AdminAnalytics from "./admin/pages/AdminAnalytics";
import AdminOrders from "./admin/pages/AdminOrders"; // ✅ ADDED
import CreatePin from "./admin/pages/CreatePin";
import Admins from "./admin/pages/Admins";
import AdminLayout from "./admin/AdminLayout";

import CartModal from "./components/CartModal";
import Footer from "./components/Footer";

import { AdminProvider } from "./context/AdminContext";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <CartModal />

        <main className="flex-1">
          <Routes>
            {/* ================= PUBLIC ================= */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />

            {/* ================= ADMIN ================= */}
            <Route
              path="/admin"
              element={
                <AdminProvider>
                  <AdminLayout />
                </AdminProvider>
              }
            >
              <Route index element={<AdminProducts />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="orders" element={<AdminOrders />} /> {/* ✅ ADDED */}
              <Route path="admins" element={<Admins />} />
              <Route path="create-pin" element={<CreatePin />} />
            </Route>

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer className="mt-auto" />
      </div>

      <Analytics />
    </BrowserRouter>
  );
}