import { useEffect, useRef, useState, useMemo } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { getWhatsAppLink } from "../../lib/whatsapp";
import { supabase } from "../lib/supabase";
import { payWithPaystack } from "../lib/paystack";

/* ================= DELIVERY CONFIG ================= */
const BASE_DELIVERY_FEE = 3000; // Starts at ₦3000 (can increase up to ₦5,000)

/* =================================================== */

export default function CartModal() {
  const {
    items,
    removeItem,
    total,
    open,
    setOpen,
    clearCart,
  } = useCart();

  const scrollYRef = useRef(0);

  const [showPaystackForm, setShowPaystackForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  /* ================= TOTAL ================= */
  const deliveryFee = BASE_DELIVERY_FEE;

  const grandTotal = useMemo(() => {
    return total + deliveryFee;
  }, [total, deliveryFee]);

  /* ================= HARD SCROLL LOCK ================= */
  useEffect(() => {
    if (open) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = "100%";
    } else {
      const y = scrollYRef.current;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, y);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [open]);

  if (!open) return null;

  /* ================= WHATSAPP CHECKOUT ================= */
  const checkoutWhatsApp = () => {
    if (!items.length) return;

    const message = items
      .map((i) => `${i.name} x${i.qty}`)
      .join(", ");

    const link = getWhatsAppLink({
      name: "Store Order",
      price: `₦${grandTotal.toLocaleString()}`,
      category: `${message} + Delivery ₦${deliveryFee.toLocaleString()}`,
    });

    window.open(link, "_blank");
  };

  /* ================= FORM VALIDATION ================= */
  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.address.trim())
      newErrors.address = "Delivery address is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SEND EMAIL ================= */
  async function sendOrderEmail(order) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-order-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ order }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      await res.json();
      return true;
    } catch (err) {
      console.error("❌ Email failed:", err);
      return false;
    }
  }

  /* ================= PAYSTACK ================= */
  const submitPaystack = () => {
    if (submitting) return;
    if (!validateForm()) return;

    const { name, email, phone, address } = form;

    setSubmitting(true);

    payWithPaystack({
      amount: grandTotal,
      email: email.trim(),

      metadata: {
        custom_fields: [
          { display_name: "Name", value: name },
          { display_name: "Phone", value: phone },
          { display_name: "Address", value: address },
          {
            display_name: "Items",
            value: items.map((i) => `${i.name} x${i.qty}`).join(", "),
          },
          {
            display_name: "Delivery Fee",
            value: `₦${deliveryFee.toLocaleString()}`,
          },
        ],
      },

      /* ✅ SUCCESS */
      onSuccess: async (response) => {
        const order = {
          name,
          email,
          phone,
          address,
          items,
          subtotal: total,
          delivery_fee: deliveryFee,
          amount: grandTotal,
          reference: response.reference,
          status: "paid",
        };

        try {
          // ✅ Save order FIRST
          const { data, error } = await supabase
            .from("orders")
            .insert([order])
            .select()
            .single();

          if (error) {
            console.error("❌ Order save failed:", error);
            alert("❌ Payment received but order could not be saved.");
            return; // 🚨 HARD STOP — nothing else runs
          }

          console.log("✅ Order saved:", data);

          // ✅ Send email only after DB success
          const emailOk = await sendOrderEmail(data);

          if (!emailOk) {
            alert("⚠️ Order saved but confirmation email failed.");
          } else {
            alert("✅ Payment successful! Confirmation email sent.");
          }

          clearCart();
          setShowPaystackForm(false);
          setOpen(false);
          setErrors({});
        } catch (err) {
          console.error("❌ Unexpected checkout error:", err);
          alert("❌ Unexpected error while processing order.");
        } finally {
          setSubmitting(false);
        }
      },

      /* ❌ CLOSED */
      onClose: () => {
        setSubmitting(false);
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-milk rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto shadow-xl"
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
          <p className="text-center opacity-70 py-10">Cart is empty</p>
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

            {/* PRICE */}
            <div className="bg-peach/30 rounded-xl p-3 mb-4 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₦{total.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>

              {/* ✅ Delivery notice */}
              <p className="text-xs text-gray-600 mt-1">
                Delivery fee starts at ₦100 and may increase up to ₦5,000
                depending on your location.
              </p>

              <div className="flex justify-between font-semibold pt-2 border-t mt-2">
                <span>Total</span>
                <span>₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* CLEAR */}
            <button
              onClick={() => {
                clearCart();
                setShowPaystackForm(false);
                setErrors({});
              }}
              className="w-full mb-4 py-2 rounded-full text-sm border border-red-300 text-red-600 hover:bg-red-50"
            >
              Clear Cart
            </button>

            {/* PAYSTACK FORM */}
            {showPaystackForm ? (
              <div className="space-y-3 pb-4">
                <input
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border"
                />

                <input
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border"
                />

                <input
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
                  disabled={submitting}
                  onClick={submitPaystack}
                  className="w-full py-3 rounded-full bg-black text-white disabled:opacity-50"
                >
                  {submitting
                    ? "Processing..."
                    : `Pay ₦${grandTotal.toLocaleString()}`}
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
                  className="w-full py-3 rounded-full bg-mauve text-white"
                >
                  Checkout via WhatsApp · ₦{grandTotal.toLocaleString()}
                </button>

                <button
                  onClick={() => setShowPaystackForm(true)}
                  className="w-full py-3 rounded-full bg-black text-white"
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
