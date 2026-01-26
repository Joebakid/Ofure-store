import { useEffect, useMemo, useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { getWhatsAppLink } from "../../lib/whatsapp";
import { supabase } from "../lib/supabase";
import { payWithPaystack } from "../lib/paystack";

export default function CartModal() {
  const {
    items,
    removeItem,
    total,
    open,
    setOpen,
    clearCart,
  } = useCart();

  const [showPaystackForm, setShowPaystackForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  /* ================= LOCK BODY SCROLL WHEN OPEN ================= */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  /* ================= VALIDATION ================= */
  const validate = () => {
    const nextErrors = {};

    if (!form.name || form.name.trim().length < 2) {
      nextErrors.name = "Please enter your full name";
    }

    if (
      !form.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (
      !form.phone ||
      form.phone.replace(/\D/g, "").length < 10
    ) {
      nextErrors.phone = "Please enter a valid phone number";
    }

    if (!form.address || form.address.trim().length < 5) {
      nextErrors.address = "Please enter your delivery address";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isFormValid = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
      form.phone.replace(/\D/g, "").length >= 10 &&
      form.address.trim().length >= 5
    );
  }, [form]);

  /* ================= WHATSAPP CHECKOUT ================= */
  const checkoutWhatsApp = () => {
    if (!items.length) return;

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
    if (submitting) return;

    const valid = validate();
    if (!valid) return;

    setSubmitting(true);

    payWithPaystack({
      amount: total,
      email: form.email,

      metadata: {
        custom_fields: [
          { display_name: "Name", value: form.name },
          { display_name: "Phone", value: form.phone },
          { display_name: "Address", value: form.address },
          {
            display_name: "Items",
            value: items.map((i) => `${i.name} x${i.qty}`).join(", "),
          },
        ],
      },

      /* ✅ PAYMENT SUCCESS */
      onSuccess: async (response) => {
        try {
          const order = {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            items,
            amount: total,
            reference: response.reference,
          };

          const { error } = await supabase
            .from("orders")
            .insert(order);

          if (error) {
            console.error("❌ Order save failed:", error);
            alert("Payment succeeded but order failed to save.");
          } else {
            alert("✅ Payment successful! Your order has been received.");
          }

          clearCart();
          setShowPaystackForm(false);
          setOpen(false);
        } catch (err) {
          console.error("❌ Order handling error:", err);
          alert("Order save failed after payment.");
        } finally {
          setSubmitting(false);
        }
      },

      /* ❌ PAYMENT CLOSED */
      onClose: () => {
        console.log("❌ Payment popup closed");
        setSubmitting(false);
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full 
          sm:max-w-md
          bg-milk
          rounded-t-3xl 
          sm:rounded-3xl
          p-6
          max-h-[90vh]
          overflow-y-auto
          shadow-xl
        "
      >
        {/* HEADER */}
        <div className="sticky top-0 bg-milk pb-4 flex justify-between items-center z-10">
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
            <div className="space-y-4 mb-4">
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

            {/* CLEAR CART */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearCart();
                setShowPaystackForm(false);
              }}
              className="w-full mb-4 py-2 rounded-full text-sm border border-red-300 text-red-600 hover:bg-red-50 cursor-pointer"
            >
              Clear Cart
            </button>

            {/* PAYSTACK FORM */}
            {showPaystackForm ? (
              <div className="space-y-3 pb-4">
                {/* NAME */}
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* EMAIL */}
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* PHONE */}
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* ADDRESS */}
                <div>
                  <textarea
                    placeholder="Delivery Address"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border resize-none"
                    rows={3}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={!isFormValid || submitting}
                  onClick={submitPaystack}
                  className="w-full py-3 rounded-full bg-black text-white text-sm disabled:opacity-40"
                >
                  {submitting
                    ? "Processing..."
                    : `Pay ₦${total.toLocaleString()}`}
                </button>

                <button
                  onClick={() => setShowPaystackForm(false)}
                  className="w-full text-sm opacity-70"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="space-y-3 pb-4">
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
