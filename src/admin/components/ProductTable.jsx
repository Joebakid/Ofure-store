import { useEffect, useState } from "react";
import ProductRow from "./ProductRow";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";

const ITEMS_PER_PAGE = 8;
const MIN_LOADING_TIME = 600;

export default function ProductTable({
  products = [],
  loading,
  onUpdate,
  onRequestDelete, // ✅ renamed
  canDelete,
}) {
  const [page, setPage] = useState(1);
  const [showLoader, setShowLoader] = useState(true);

  /* ================= RESET PAGE ON DATA CHANGE ================= */
  useEffect(() => {
    setPage(1);
  }, [products.length]);

  /* ================= FORCE MINIMUM LOADER DISPLAY ================= */
  useEffect(() => {
    let timer;

    if (loading) {
      setShowLoader(true);
    } else {
      timer = setTimeout(() => {
        setShowLoader(false);
      }, MIN_LOADING_TIME);
    }

    return () => clearTimeout(timer);
  }, [loading]);

  /* ================= LOADING ================= */
  if (showLoader) {
    return (
      <div className="mt-10 min-h-[280px] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (!products.length) {
    return (
      <div className="mt-10 min-h-[240px] flex items-center justify-center">
        <p className="text-center opacity-60">
          No products yet.
        </p>
      </div>
    );
  }

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(
    products.length / ITEMS_PER_PAGE
  );

  const paginatedProducts = products.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ================= LIST ================= */
  return (
    <div className="mt-10 space-y-6">
      <div className="space-y-4">
        {paginatedProducts.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            onUpdate={onUpdate}
            onRequestDelete={onRequestDelete} // ✅ IMPORTANT
            loading={loading}
            canDelete={canDelete}
          />
        ))}
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="pt-6"
      />
    </div>
  );
}
