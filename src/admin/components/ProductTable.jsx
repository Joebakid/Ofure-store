import { useEffect, useState } from "react";
import ProductRow from "./ProductRow";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";

const ITEMS_PER_PAGE = 8;

export default function ProductTable({
  products = [],
  loading,
  onUpdate,
  onDelete,
}) {
  const [page, setPage] = useState(1);

  /* ================= RESET PAGE ON DATA CHANGE ================= */
  useEffect(() => {
    setPage(1);
  }, [products.length]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="mt-10 flex justify-center py-20">
        <Loader />
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (!products.length) {
    return (
      <p className="text-center opacity-60 py-16">
        No products yet.
      </p>
    );
  }

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

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
            onDelete={onDelete}
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
