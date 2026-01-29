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

  /* ================= DELETE (EXECUTION ONLY) ================= */
  async function deleteProduct(productId, imagePath) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("❌ delete failed", error);
      return false;
    }

    if (imagePath) {
      await supabase.storage.from("products").remove([imagePath]);
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
