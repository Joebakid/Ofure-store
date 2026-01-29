import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

import AdminHeader from "../components/AdminHeader";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import OwnerPinModal from "../components/OwnerPinModal";
import { useAdminProducts } from "../hooks/useAdminProducts";
import Loader from "../../components/Loader";
import { useAdmin } from "../../context/AdminContext";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [formKey, setFormKey] = useState(0);

  // 🔐 PIN modal state
  const [pinOpen, setPinOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const { admin, loading: adminLoading } = useAdmin();

  const {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useAdminProducts(admin);

  const isOwner = admin?.role === "owner";

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  async function handleCreate(product, imageFile) {
    await createProduct(product, imageFile);
    setFormKey((k) => k + 1);
  }

  // 🧨 user clicked delete → ask for PIN
  function handleRequestDelete(product) {
    if (!isOwner) return;
    setPendingDelete(product);
    setPinOpen(true);
  }

  // ✅ PIN approved → delete for real
  async function handleApprovedDelete() {
    if (!pendingDelete) return;

    await deleteProduct(
      pendingDelete.id,
      pendingDelete.image
    );

    setPendingDelete(null);
  }

  if (adminLoading) {
    return (
      <div className="app-container py-20 flex justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto overflow-x-hidden">
      <AdminHeader onLogout={handleLogout} />

      <ProductForm
        key={formKey}
        onCreate={handleCreate}
        loading={loading}
      />

      {(loading || adminLoading) && <Loader />}

      <ProductTable
        products={products}
        loading={loading}
        onUpdate={updateProduct}
        onRequestDelete={handleRequestDelete} // ✅ IMPORTANT
        canDelete={isOwner}
      />

      {/* 🔐 OWNER PIN MODAL */}
      <OwnerPinModal
        open={pinOpen}
        onClose={() => {
          setPinOpen(false);
          setPendingDelete(null);
        }}
        onApproved={handleApprovedDelete}
      />
    </div>
  );
}
