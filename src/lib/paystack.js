export function payWithPaystack({
  amount,
  email,
  metadata,
  onSuccess,
  onClose,
}) {
  if (!window.PaystackPop) {
    alert("Paystack not loaded");
    return;
  }

  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email,
    amount: amount * 100, // kobo
    currency: "NGN",
    ref: `${Date.now()}`,
    metadata,
    callback: function (response) {
      onSuccess(response);
    },
    onClose: function () {
      onClose?.();
    },
  });

  handler.openIframe();
}
