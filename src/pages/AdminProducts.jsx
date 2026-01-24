import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const CATEGORIES = ["Shirts", "Forever"];

function normalizeImagePath(image) {
  if (!image) return null;
  if (image.startsWith("http")) {
    const split = image.split("/products/");
    return split[1] ? decodeURIComponent(split[1]) : null;
  }
  return image;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: CATEGORIES[0],
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  // ================= LOGOUT =================
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // ================= FETCH =================
  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    const withImages = (data || []).map((p) => {
      const clean = normalizeImagePath(p.image);
      const { data: img } = supabase.storage
        .from("products")
        .getPublicUrl(clean);

      return { ...p, image: clean, imageUrl: img.publicUrl };
    });

    setProducts(withImages);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= ADD =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || loading) return;

    setLoading(true);
    setStatus(null);

    try {
      const path = `${Date.now()}-${imageFile.name}`;
      await supabase.storage.from("products").upload(path, imageFile);

      await supabase.from("products").insert({
        ...form,
        price: Number(form.price),
        image: path,
      });

      setStatus({ type: "success", text: "Product added successfully 🎉" });

      setForm({
        name: "",
        price: "",
        category: CATEGORIES[0],
        description: "",
      });
      setImageFile(null);
      setPreview(null);

      fetchProducts();
    } catch {
      setStatus({ type: "error", text: "Failed to add product" });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  // ================= EDIT =================
  const startEdit = (p) => {
    setEditingId(p.id);
    setEditForm({
      name: p.name,
      price: p.price,
      category: p.category,
      description: p.description,
    });
    setEditImage(null);
    setEditPreview(p.imageUrl);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
    setEditImage(null);
    setEditPreview(null);
  };

  const saveEdit = async (p) => {
    if (loading) return;
    setLoading(true);
    setStatus(null);

    try {
      let imagePath = p.image;

      if (editImage) {
        await supabase.storage.from("products").remove([imagePath]);
        const newPath = `${Date.now()}-${editImage.name}`;
        await supabase.storage.from("products").upload(newPath, editImage);
        imagePath = newPath;
      }

      await supabase
        .from("products")
        .update({
          ...editForm,
          price: Number(editForm.price),
          image: imagePath,
        })
        .eq("id", p.id);

      setStatus({ type: "success", text: "Product updated successfully ✅" });
      cancelEdit();
      fetchProducts();
    } catch {
      setStatus({ type: "error", text: "Update failed" });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  // ================= DELETE =================
  const deleteProduct = async (p) => {
    if (!confirm(`Delete "${p.name}"?`) || loading) return;

    setLoading(true);
    setStatus(null);

    try {
      await supabase.storage.from("products").remove([p.image]);
      await supabase.from("products").delete().eq("id", p.id);

      setStatus({ type: "success", text: "Product deleted 🗑️" });
      fetchProducts();
    } catch {
      setStatus({ type: "error", text: "Delete failed" });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  // ================= UI =================
  return (
    <div className="section section-pad max-w-6xl mx-auto relative">
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur flex items-center justify-center z-50 rounded-xl">
          <div className="animate-pulse text-mauve font-semibold">
            Processing…
          </div>
        </div>
      )}

      {status && (
        <div
          className={`mb-6 px-4 py-2 rounded text-sm ${
            status.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.text}
        </div>
      )}

      {/* TOP ACTION BAR */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/shop")}
          className="px-5 py-2 rounded-full bg-mauve text-white"
        >
          ← Go to Store
        </button>

        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Logout
        </button>
      </div>

      {/* ADD PRODUCT */}
      <form
        onSubmit={handleSubmit}
        className="bg-milk p-6 rounded-2xl shadow max-w-xl mx-auto mb-12"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Add Product
        </h2>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 rounded w-full mb-2"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="p-2 rounded w-full mb-2"
          required
        />

        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          className="p-2 rounded w-full mb-2"
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="p-2 rounded w-full mb-2"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files[0];
            setImageFile(f);
            setPreview(URL.createObjectURL(f));
          }}
          required
        />

        {preview && (
          <img
            src={preview}
            className="mt-3 w-32 h-32 object-cover rounded"
          />
        )}

        <button
          disabled={loading}
          className="mt-4 bg-mauve text-white py-2 rounded w-full disabled:opacity-60"
        >
          Add Product
        </button>
      </form>

      {/* PRODUCT LIST */}
      <div className="grid gap-4">
        {products.map((p) => {
          const isEditing = editingId === p.id;

          return (
            <div
              key={p.id}
              className="bg-peach/40 p-4 rounded-xl flex gap-4 items-center"
            >
              <img
                src={isEditing ? editPreview : p.imageUrl}
                className="w-24 h-24 object-cover rounded"
              />

              <div className="flex-1 space-y-1">
                {isEditing ? (
                  <>
                    <input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="p-1 rounded w-full"
                    />
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: e.target.value })
                      }
                      className="p-1 rounded w-full"
                    />
                    <select
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          category: e.target.value,
                        })
                      }
                      className="p-1 rounded w-full"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      className="p-1 rounded w-full"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files[0];
                        setEditImage(f);
                        setEditPreview(URL.createObjectURL(f));
                      }}
                    />
                  </>
                ) : (
                  <>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm opacity-70">
                      ₦{Number(p.price).toLocaleString()} • {p.category}
                    </p>
                    <p className="text-xs opacity-50">
                      Uploaded: {formatDate(p.created_at)}
                    </p>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => saveEdit(p)}
                      className="text-sm text-mauve"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-sm text-gray-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(p)}
                      className="text-sm text-mauve"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p)}
                      className="text-sm text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
