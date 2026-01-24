import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

import BackButton from "../../components/BackButton";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import { useAdminProducts } from "../hooks/useAdminProducts";
import Loader from "../../components/Loader";

export default function AdminProducts() {
  const navigate = useNavigate();

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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-6">
        {/* CONSISTENT BACK */}
        <BackButton to="/shop" />

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-pink-500 text-white"
        >
          Logout
        </button>
      </div>

      {/* ADD PRODUCT */}
      <ProductForm onCreate={createProduct} loading={loading} />

      {loading && <Loader />}

      {/* PRODUCTS */}
      <ProductTable
        products={products}
        loading={loading}
        onDelete={deleteProduct}
        onUpdate={updateProduct}
      />
    </div>
  );
}
