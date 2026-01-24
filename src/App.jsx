import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import AdminProducts from "./admin/pages/AdminProducts";
import RequireAuth from "./components/RequireAuth";
import CartModal from "./components/CartModal";

export default function App() {
  return (
    <BrowserRouter>
      {/* Cart modal must live outside Routes */}
      <CartModal />

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
    </BrowserRouter>
  );
}
