import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import AdminProducts from "./admin/pages/AdminProducts";
import RequireAuth from "./components/RequireAuth";
import CartModal from "./components/CartModal";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      {/* App layout */}
      <div className="flex min-h-screen flex-col">
        {/* Global UI */}
        <CartModal />

        {/* Main content */}
        <main className="flex-1">
          <Routes>
            {/* ================= PUBLIC ================= */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />

            {/* ================= ADMIN ================= */}
            <Route
              path="/admin/products"
              element={
                <RequireAuth>
                  <AdminProducts />
                </RequireAuth>
              }
            />

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer always at bottom */}
        <Footer className="mt-auto" />
      </div>
    </BrowserRouter>
  );
}
