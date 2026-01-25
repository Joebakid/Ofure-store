import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getCartId } from "../lib/cartId";

/* ======================================================
   CONTEXT
====================================================== */
const CartContext = createContext(null);

/* ======================================================
   PROVIDER
====================================================== */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  // 🔔 notification trigger
  const [cartEventId, setCartEventId] = useState(0);
  const [cartMessage, setCartMessage] = useState("");

  const cartId = getCartId();

  /* ================= LOAD CART ================= */
  useEffect(() => {
    async function loadCart() {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("cart_id", cartId);

      if (error) {
        console.error("❌ Cart load error:", error);
        return;
      }

      setItems(data || []);
    }

    loadCart();
  }, [cartId]);

  /* ================= PRICE NORMALIZER ================= */
  const normalizePrice = (price) => {
    if (typeof price === "number") return price;
    if (typeof price === "string")
      return Number(price.replace(/,/g, ""));
    return 0;
  };

  /* ================= ADD ITEM ================= */
  const addItem = async (product) => {
    const price = normalizePrice(product.price);
    const existing = items.find((i) => i.name === product.name);

    if (existing) {
      const newQty = existing.qty + 1;

      await supabase
        .from("cart_items")
        .update({ qty: newQty })
        .eq("id", existing.id);

      setItems((prev) =>
        prev.map((i) =>
          i.id === existing.id ? { ...i, qty: newQty } : i
        )
      );

      setCartMessage(`Added again • ${product.name}`);
      setCartEventId((id) => id + 1);
      return;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .insert([
        {
          cart_id: cartId,
          name: product.name,
          image: product.image,
          price,
          qty: 1,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Insert error:", error);
      return;
    }

    setItems((prev) => [...prev, data]);
    setCartMessage(`Added to cart • ${product.name}`);
    setCartEventId((id) => id + 1);
  };

  /* ================= REMOVE ITEM ================= */
  const removeItem = async (name) => {
    const item = items.find((i) => i.name === name);
    if (!item) return;

    await supabase.from("cart_items").delete().eq("id", item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  /* ================= CLEAR CART (THE FIX) ================= */
  const clearCart = async () => {
    if (!items.length) return;

    const ids = items.map((i) => i.id);

    await supabase
      .from("cart_items")
      .delete()
      .in("id", ids);

    setItems([]); // ✅ clears UI
    setCartMessage("Cart cleared");
    setCartEventId((id) => id + 1);
  };

  /* ================= TOTAL ================= */
  const total = items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart, // ✅ now works
        total,
        open,
        setOpen,
        cartEventId,
        cartMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ======================================================
   HOOK
====================================================== */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
