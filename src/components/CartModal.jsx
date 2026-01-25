import { useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { getWhatsAppLink } from "../../lib/whatsapp";

export default function CartModal() {
  const { items, removeItem, total, open, setOpen } = useCart();

  const [showPaystackForm, setShowPaystackForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  if (!open) return null;

  /* ================= WHATSAPP CHECKOUT ================= */
  const checkoutWhatsApp = () => {
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

  /* ================= PAYSTACK SUBMIT ================= */
  const submitPaystack = () => {
    const { name, email, phone, address } = form;

    if (!name || !email || !phone || !address) {
      alert("Please fill all fields");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email,
      amount: total * 100,
      currency: "NGN",
      ref: `LOL-${Date.now()}`,
      metadata: {
        custom_fields: [
          { display_name: "Name", value: name },
          { display_name: "Phone", value: phone },
          { display_name: "Address", value: address },
          {
            display_name: "Items",
            value: items.map((i) => `${i.name} x${i.qty}`).join(", "),
          },
        ],
      },
      callback: function (response) {
        alert(`Payment successful!\nRef: ${response.reference}`);
        setShowPaystackForm(false);
        setOpen(false);
      },
      onClose: function () {
        console.log("Payment window closed");
      },
    });

    handler.openIframe();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="bg-milk w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-lg">Your Cart</h2>
          <button onClick={() => setOpen(false)}>
            <FaTimes />
          </button>
        </div>

        {/* EMPTY */}
        {items.length === 0 ? (
          <p className="text-center opacity-70 py-10">
            Cart is empty
          </p>
        ) : (
          <>
            {/* ITEMS */}
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

            {/* PAYSTACK FORM */}
            {showPaystackForm ? (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border"
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border"
                />

                <textarea
                  placeholder="Delivery Address"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border resize-none"
                  rows={3}
                />

                <button
                  onClick={submitPaystack}
                  className="w-full py-3 rounded-full bg-black text-white text-sm"
                >
                  Pay ₦{total.toLocaleString()}
                </button>

                <button
                  onClick={() => setShowPaystackForm(false)}
                  className="w-full text-sm opacity-70"
                >
                  Cancel
                </button>
              </div>
            ) : (
              /* ACTION BUTTONS */
              <div className="space-y-3">
                <button
                  onClick={checkoutWhatsApp}
                  className="w-full py-3 rounded-full bg-mauve text-white text-sm"
                >
                  Checkout via WhatsApp · ₦{total.toLocaleString()}
                </button>

                <button
                  onClick={() => setShowPaystackForm(true)}
                  className="w-full py-3 rounded-full bg-black text-white text-sm"
                >
                  Checkout via Paystack
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
