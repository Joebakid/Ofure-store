import { useState } from "react";
import { payWithPaystack } from "../lib/paystack";

export default function PaystackCheckout({ amount, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const disabled =
    !form.name || !form.email || !form.phone || !form.address;

  function handlePay() {
    payWithPaystack({
      amount,
      email: form.email,
      metadata: {
        name: form.name,
        phone: form.phone,
        address: form.address,
      },
      onSuccess,
      onClose: () => {
        alert("Payment cancelled");
      },
    });
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-center">
        Checkout with Paystack
      </h3>

      <input
        className="input"
        placeholder="Full name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        className="input"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        className="input"
        placeholder="Phone number"
        value={form.phone}
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
      />

      <textarea
        className="input"
        placeholder="Delivery address"
        value={form.address}
        onChange={(e) =>
          setForm({ ...form, address: e.target.value })
        }
      />

      <button
        disabled={disabled}
        onClick={handlePay}
        className={`w-full py-3 rounded-full text-white ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-mauve hover:opacity-90"
        }`}
      >
        Pay ₦{amount.toLocaleString()}
      </button>
    </div>
  );
}
