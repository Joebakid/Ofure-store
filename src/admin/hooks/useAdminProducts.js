import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { normalizeImagePath } from "../utils/normalizeImagePath";

export function useAdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchProducts() {
    console.log("📦 fetchProducts");
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ fetch error", error);
      return;
    }

    setProducts(
      data.map((p) => ({
        ...p,
        image: normalizeImagePath(p.image),
      }))
    );
  }

  async function createProduct(payload) {
    console.log("🟢 createProduct", payload);
    setLoading(true);

    let imagePath = null;

    if (payload.imageFile) {
      const ext = payload.imageFile.name.split(".").pop();
      imagePath = `${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("products")
        .upload(imagePath, payload.imageFile);

      if (error) {
        console.error("❌ upload error", error);
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase.from("products").insert({
      name: payload.name,
      price: payload.price,
      category: payload.category,
      description: payload.description,
      image: imagePath,
    });

    if (error) console.error("❌ insert error", error);

    await fetchProducts();
    setLoading(false);
  }

  async function updateProduct(id, updates, imageFile) {
    console.log("✏️ updateProduct", id, updates);
    setLoading(true);

    let imagePath = updates.image;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      imagePath = `${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("products")
        .upload(imagePath, imageFile);

      if (error) {
        console.error("❌ image update error", error);
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase
      .from("products")
      .update({ ...updates, image: imagePath })
      .eq("id", id);

    if (error) console.error("❌ update error", error);

    await fetchProducts();
    setLoading(false);
  }

  async function deleteProduct(id, image) {
    console.log("🗑 deleteProduct", id);

    if (image) {
      await supabase.storage.from("products").remove([image]);
    }

    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
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
