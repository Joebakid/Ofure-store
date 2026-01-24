export default function ProductCard({ product, onAdd }) {
  console.log("🧱 ProductCard rendered:", product.name);

  return (
    <div className="bg-peach/40 rounded-3xl p-4 shadow-lg flex flex-col relative">
      <div className="w-full h-48 rounded-2xl overflow-hidden mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="font-semibold mb-1">{product.name}</h3>

      <p className="font-semibold mb-4">
        ₦{Number(product.price).toLocaleString()}
      </p>

      {/* 🔴 THIS IS THE CRITICAL BUTTON */}
      <button
        type="button"
        onClick={() => {
          console.log("🟢 ADD CLICK:", product.name);
          if (onAdd) onAdd();
          else console.warn("⚠️ onAdd not provided");
        }}
        className="mt-auto w-full py-2.5 rounded-full bg-mauve text-white active:scale-95 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
