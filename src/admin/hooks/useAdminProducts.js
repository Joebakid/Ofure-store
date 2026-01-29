import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { normalizeImagePath } from "../utils/normalizeImagePath";

// ✅ Analytics
import { EVENTS } from "../../analytics/analyticsEvents";
import { logEvent } from "../../analytics/analyticsClient";

export function useAdminProducts(admin) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ fetch error", error);
      return;
    }

    setProducts(
      (data || []).map((p) => ({
        ...p,
        image: normalizeImagePath(p.image),
      }))
    );
  }

  /* ================= CREATE ================= */
  async function createProduct(payload) {
    setLoading(true);

    let imagePath = null;

    if (payload.imageFile) {
      const ext = payload.imageFile.name.split(".").pop();
      imagePath = `${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("products")
        .upload(imagePath, payload.imageFile);

      if (error) {
        setLoading(false);
        return;
      }
    }

    const { data: inserted, error } = await supabase
      .from("products")
      .insert({
        name: payload.name,
        price: payload.price,
        category: payload.category,
        description: payload.description,
        image: imagePath,
      })
      .select()
      .single();

    if (!error && inserted) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      logEvent(
        EVENTS.PRODUCT_CREATE,
        { name: inserted.name, email: user?.email },
        user?.id
      );
    }

    await fetchProducts();
    setLoading(false);
  }

  /* ================= UPDATE ================= */
  async function updateProduct(id, updates, imageFile) {
    setLoading(true);

    let imagePath = updates.image;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      imagePath = `${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("products")
        .upload(imagePath, imageFile);

      if (error) {
        setLoading(false);
        return;
      }
    }

    await supabase
      .from("products")
      .update({ ...updates, image: imagePath })
      .eq("id", id);

    await fetchProducts();
    setLoading(false);
  }

  /* ================= DELETE (OWNER + PIN) ================= */
  async function deleteProduct(id, image) {
    // 🔒 OWNER ONLY
    if (admin?.role !== "owner") {
      alert("Owner approval required");
      return false;
    }

    // 🔑 ASK FOR PIN
    const pin = prompt("Enter owner PIN");
    if (!pin) return false;

    // 🔐 HASH PIN
    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(pin)
    );

    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // 🔎 FETCH STORED PIN
    const { data: owner, error } = await supabase
      .from("admins")
      .select("pin_hash")
      .eq("id", admin.id)
      .single();

    if (error || !owner?.pin_hash) {
      alert("Owner PIN not set");
      return false;
    }

    if (owner.pin_hash !== hashHex) {
      alert("Invalid PIN");
      return false;
    }

    // 🗑 DELETE PRODUCT
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("❌ delete failed", deleteError);
      alert("Delete failed");
      return false;
    }

    // 🧹 DELETE IMAGE
    if (image) {
      await supabase.storage.from("products").remove([image]);
    }

    await fetchProducts();
    return true;
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
