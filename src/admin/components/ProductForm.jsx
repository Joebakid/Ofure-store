import { useState } from "react";
import { CATEGORIES } from "../utils/categories";

// ✅ Analytics
import { EVENTS } from "../../analytics/analyticsEvents";
import { useAnalytics } from "../../analytics/useAnalytics";
import { supabase } from "../../lib/supabase";

export default function ProductForm({ onCreate, loading }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // ✅ Get logged-in admin
  const [adminId, setAdminId] = useState(null);

  // Load current admin once
  useState(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setAdminId(data.user.id);
      }
    });
  }, []);

  const analytics = useAnalytics(adminId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productPayload = {
      name,
      price: Number(price),
      category,
      description,
      imageFile,
    };

    // create product
    const createdProduct = await onCreate(productPayload);

    // ✅ Track product creation
    if (createdProduct?.id) {
      analytics.track(EVENTS.PRODUCT_CREATE, {
        productId: createdProduct.id,
        name,
      });
    }

    // reset form
    setName("");
    setPrice("");
    setDescription("");
    setImageFile(null);
  };

  return (
    <form
      className="bg-white p-6 rounded-2xl shadow mb-10 max-w-md mx-auto"
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg font-semibold mb-4 text-center">
        Add Product
      </h2>

      <input
        className="input mb-3"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        className="input mb-3"
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <select
        className="input mb-3"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <textarea
        className="input mb-3"
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <input
        type="file"
        className="mb-4"
        accept="image/*"
        onChange={(e) =>
          setImageFile(e.target.files[0])
        }
      />

      <button
        disabled={loading}
        className="w-full bg-mauve text-white py-2 rounded disabled:opacity-60"
      >
        {loading ? "Adding…" : "Add Product"}
      </button>
    </form>
  );
}
