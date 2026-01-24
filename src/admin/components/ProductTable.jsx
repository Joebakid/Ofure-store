import ProductRow from "./ProductRow";
import Loader from "../../components/Loader";

export default function ProductTable({
  products,
  loading,
  onUpdate,
  onDelete,
}) {
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

  /* ================= LIST ================= */
  return (
    <div className="mt-10 space-y-4">
      {products.map((product) => (
        <ProductRow
          key={product.id}
          product={product}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
