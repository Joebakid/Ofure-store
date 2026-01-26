import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

import AdminHeader from "../components/AdminHeader";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import { useAdminProducts } from "../hooks/useAdminProducts";
import Loader from "../../components/Loader";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [formKey, setFormKey] = useState(0);

  const {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useAdminProducts();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  async function handleCreate(product, imageFile) {
    await createProduct(product, imageFile);

    // 🔥 Reset form after successful create
    setFormKey((k) => k + 1);
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto overflow-x-hidden">
      {/* ✅ HEADER (Back + Analytics + Logout) */}
      <AdminHeader onLogout={handleLogout} />

      {/* ADD PRODUCT */}
      <ProductForm
        key={formKey}
        onCreate={handleCreate}
        loading={loading}
      />

      {loading && <Loader />}

      {/* PRODUCTS */}
      <div className="overflow-x-hidden">
        <ProductTable
          products={products}
          loading={loading}
          onDelete={deleteProduct}
          onUpdate={updateProduct}
        />
      </div>
    </div>
  );
}
