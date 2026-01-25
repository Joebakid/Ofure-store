import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();

  const {
    items,
    removeItem,
    clearCart,
    total,
    setOpen, // 👈 open CartModal (Paystack / WhatsApp)
  } = useCart();

  return (
    <section className="section section-pad min-h-screen">
      {/* HEADER */}
      <div className="flex items-center mb-10">
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 text-sm hover:text-mauve transition"
        >
          <FaArrowLeft />
          Back to Store
        </button>

        <h1 className="text-xl sm:text-2xl font-semibold mx-auto">
          Your Cart
        </h1>
      </div>

      {/* EMPTY STATE */}
      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="opacity-70 mb-6">Your cart is empty</p>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-3 rounded-full bg-mauve text-white text-sm"
          >
            Go to Store
          </button>
        </div>
      ) : (
        <>
          {/* ITEMS */}
          <div className="space-y-6 mb-10">
            {items.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-4 bg-peach/40 p-4 rounded-3xl"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-2xl object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm opacity-70">
                    ₦{item.price.toLocaleString()} × {item.qty}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.name)}
                  className="text-mauve hover:opacity-70"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="space-y-4">
            {/* TOTAL */}
            <div className="bg-milk/70 p-6 rounded-3xl flex items-center justify-between">
              <span className="font-semibold">
                Total: ₦{total.toLocaleString()}
              </span>

              <button
                onClick={() => setOpen(true)} // 👈 open CartModal
                className="px-6 py-3 rounded-full bg-mauve text-white text-sm"
              >
                Checkout
              </button>
            </div>

            {/* CLEAR CART */}
            <button
              onClick={clearCart}
              className="w-full py-2 rounded-full text-sm border border-red-300 text-red-600 hover:bg-red-50"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </section>
  );
}
