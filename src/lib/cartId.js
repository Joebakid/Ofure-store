// src/lib/cartId.js
export function getCartId() {
  let id = localStorage.getItem("cart_id");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("cart_id", id);
  }

  return id;
}
