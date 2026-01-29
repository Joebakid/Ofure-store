import { useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { formatDate } from "../utils/formatDate";
import { CATEGORIES } from "../utils/categories";

export default function ProductRow({
  product,
  onUpdate,
  onDelete,
  loading,
  canDelete,
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

  async function handleSave() {
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
  }

  async function handleDelete() {
    if (!canDelete) {
      alert("Owner approval required");
      return;
    }

    if (!window.confirm("Delete this product?")) return;

    setDeleting(true);

    // ✅ only mark deleted if DB deletion succeeds
    const success = await onDelete(product.id, product.image);

    if (success) {
      setDeleted(true);
    }

    setDeleting(false);
  }

  return (
    <div className="relative bg-white/70 rounded-xl p-4 mb-4">
      {(saving || deleting || loading) && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          {deleting ? "Deleting…" : "Saving…"}
        </div>
      )}

      {deleted && (
        <div className="absolute inset-0 bg-green-50 flex items-center justify-center z-10">
          ✅ Deleted
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-20 h-20">
          {data?.publicUrl && (
            <img
              src={data.publicUrl}
              className="w-full h-full object-cover rounded-lg"
              alt={product.name}
            />
          )}
        </div>

        <div className="flex-1 space-y-2">
          {editing ? (
            <>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="input"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <select
                className="input"
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
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </>
          ) : (
            <>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-600">
                ₦{product.price} • {product.category}
              </p>
              <p className="text-xs text-gray-400">
                {formatDate(product.created_at)}
              </p>
            </>
          )}
        </div>

        <div className="flex gap-3 items-start">
          {editing ? (
            <>
              <button onClick={handleSave} className="text-green-600">
                Save
              </button>
              <button onClick={() => setEditing(false)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="text-blue-500"
              >
                Edit
              </button>

              <button
                onClick={handleDelete}
                disabled={!canDelete}
                className={`text-red-500 ${
                  !canDelete ? "opacity-40 cursor-not-allowed" : ""
                }`}
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
