export default function ProductCard({ product, onAdd, onPreview }) {
  console.log("🧱 ProductCard rendered:", product.name);

  return (
    <div className="bg-peach/40 rounded-3xl p-3 shadow-md flex flex-col relative hover:shadow-lg transition">
      {/* IMAGE */}
      <button
        type="button"
        onClick={() => {
          if (onPreview) onPreview();
        }}
        className="w-full h-40 rounded-2xl overflow-hidden mb-3"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition"
        />
      </button>

      {/* NAME */}
      <h3 className="font-semibold text-sm mb-1 line-clamp-1">
        {product.name}
      </h3>

      {/* DESCRIPTION */}
      {product.description && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {product.description}
        </p>
      )}

      {/* PRICE */}
      <p className="font-semibold text-sm mb-3">
        ₦{Number(product.price).toLocaleString()}
      </p>

      {/* ADD TO CART */}
      <button
        type="button"
        onClick={() => {
          console.log("🟢 ADD CLICK:", product.name);
          if (onAdd) onAdd();
          else console.warn("⚠️ onAdd not provided");
        }}
        className="mt-auto w-full py-2 rounded-full bg-mauve text-white text-sm active:scale-95 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
