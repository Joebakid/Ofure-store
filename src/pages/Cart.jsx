import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();

  // TEMP dummy data (we'll replace this)
  const cartItems = [
    {
      id: 1,
      name: "Forever Aloe Vera Gel",
      price: 25000,
      image:
        "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=500",
      qty: 1,
    },
  ];

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <section className="section section-pad">
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

      {/* CART CONTENT */}
      {cartItems.length === 0 ? (
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
            {cartItems.map((item) => (
              <div
                key={item.id}
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
                    ₦{item.price.toLocaleString()}
                  </p>
                </div>

                <button className="text-mauve hover:opacity-70">
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="bg-milk/70 p-6 rounded-3xl flex items-center justify-between">
            <span className="font-semibold">
              Total: ₦{total.toLocaleString()}
            </span>

            <button className="px-6 py-3 rounded-full bg-mauve text-white text-sm">
              Checkout
            </button>
          </div>
        </>
      )}
    </section>
  );
}
