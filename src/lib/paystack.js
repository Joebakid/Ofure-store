export function payWithPaystack({
  amount,
  email,
  metadata,
  onSuccess,
  onClose,
}) {
  if (!window.PaystackPop) {
    alert("Paystack not loaded. Please refresh.");
    return;
  }

  try {
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email,
      amount: amount * 100, // kobo
      currency: "NGN",
      ref: `LOL-${Date.now()}`,
      metadata,

      callback: function (response) {
        onSuccess?.(response);
      },

      onClose: function () {
        onClose?.();
      },
    });

    handler.openIframe();
  } catch (err) {
    console.error("❌ Paystack init error:", err);
    alert("Unable to open payment window.");
  }
}
