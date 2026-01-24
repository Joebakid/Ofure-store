import { useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { formatDate } from "../utils/formatDate";

const CATEGORIES = ["Shirts", "Forever"];

export default function ProductRow({
  product,
  onUpdate,
  onDelete,
  loading,
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [category, setCategory] = useState(product.category);
  const [imageFile, setImageFile] = useState(null);

  const fileRef = useRef(null);

  const { data } = product.image
    ? supabase.storage.from("products").getPublicUrl(product.image)
    : { data: { publicUrl: null } };

  function resetFileInput() {
    setImageFile(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  async function handleSave() {
    if (typeof onUpdate !== "function") return;

    setSaving(true);

    await onUpdate(
      product.id,
      {
        name,
        price: Number(price),
        category,
        image: product.image,
      },
      imageFile
    );

    setSaving(false);
    setEditing(false);
    resetFileInput();
  }

  function handleCancel() {
    setEditing(false);
    resetFileInput();
  }

  async function handleDelete() {
    if (deleting) return;

    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirm) return;

    try {
      setDeleting(true);

      await onDelete(product.id, product.image);

      // Show deleted feedback briefly before unmount
      setDeleted(true);

      setTimeout(() => {
        // Row will unmount naturally when parent updates list
      }, 600);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete product.");
      setDeleting(false);
    }
  }

  return (
    <div className="relative bg-white/70 rounded-xl p-4 mb-4 overflow-hidden">
      {(saving || loading || deleting) && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl z-10">
          <span className="text-sm">
            {deleting ? "Deleting…" : "Saving…"}
          </span>
        </div>
      )}

      {deleted && (
        <div className="absolute inset-0 bg-green-50 flex items-center justify-center rounded-xl z-10">
          <span className="text-sm text-green-700 font-medium">
            ✅ Deleted successfully
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {/* IMAGE */}
        <div className="w-20 h-20 flex-shrink-0 mx-auto sm:mx-0">
          {data?.publicUrl && (
            <img
              src={data.publicUrl}
              className="w-full h-full object-cover rounded-lg"
              alt={product.name}
            />
          )}
        </div>

        {/* DETAILS */}
        <div className="flex-1 space-y-2 min-w-0">
          {editing ? (
            <>
              <input
                className="input w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="input w-full"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <select
                className="input w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="block w-full text-xs"
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] || null)
                }
              />
            </>
          ) : (
            <>
              <p className="font-medium truncate">
                {product.name}
              </p>

              <p className="text-sm text-gray-600 truncate">
                ₦{product.price} • {product.category}
              </p>

              <p className="text-xs text-gray-400">
                {formatDate(product.created_at)}
              </p>
            </>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex sm:flex-col justify-end gap-3 text-sm shrink-0">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-green-600 font-medium disabled:opacity-50"
              >
                Save
              </button>

              <button
                onClick={handleCancel}
                disabled={saving}
                className="text-gray-500 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                disabled={deleting}
                className="text-blue-500 font-medium disabled:opacity-50"
              >
                Edit
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-500 disabled:opacity-50"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
