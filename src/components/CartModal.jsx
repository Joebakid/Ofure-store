import { FaTimes, FaTrash } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { getWhatsAppLink } from "../../lib/whatsapp";

export default function CartModal() {
  const { items, removeItem, total, open, setOpen } = useCart();

  if (!open) return null;

  const checkout = () => {
    if (items.length === 0) return;

    const message = items
      .map((i) => `${i.name} x${i.qty}`)
      .join(", ");

    const link = getWhatsAppLink({
      name: "Store Order",
      price: `₦${total.toLocaleString()}`,
      category: message,
    });

    window.open(link, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="bg-milk w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-lg">Your Cart</h2>
          <button onClick={() => setOpen(false)}>
            <FaTimes />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-center opacity-70 py-10">
            Cart is empty
          </p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 bg-peach/40 p-3 rounded-2xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs opacity-70">
                      ₦{item.price.toLocaleString()} × {item.qty}
                    </p>
                  </div>

                  <button onClick={() => removeItem(item.name)}>
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={checkout}
              className="w-full py-3 rounded-full bg-mauve text-white text-sm"
            >
              Checkout via WhatsApp · ₦{total.toLocaleString()}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
