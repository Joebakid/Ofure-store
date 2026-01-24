import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";
import CartModal from "./components/CartModal";

import AdminProducts from "./pages/AdminProducts";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";

export default function App() {
  return (
    <BrowserRouter>
      {/* Cart modal lives globally */}
      <CartModal />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Admin */}
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminProducts />
          </RequireAuth>
        }
      />
        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
