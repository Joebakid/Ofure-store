import { useState } from "react";
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

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [category, setCategory] = useState(product.category);
  const [imageFile, setImageFile] = useState(null);

  const { data } = product.image
    ? supabase.storage.from("products").getPublicUrl(product.image)
    : { data: { publicUrl: null } };

  async function handleSave() {
    console.log("💾 handleSave called");

    if (typeof onUpdate !== "function") {
      console.error("❌ onUpdate is not a function");
      return;
    }

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
    setImageFile(null);
  }

  return (
    <div className="relative bg-white/70 rounded-xl p-4 flex gap-5 mb-4">
      {(saving || loading) && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
          <span className="text-sm">Saving…</span>
        </div>
      )}

      {/* IMAGE */}
      <div className="w-24 h-24 flex-shrink-0">
        {data?.publicUrl && (
          <img
            src={data.publicUrl}
            className="w-full h-full object-cover rounded-lg"
          />
        )}
      </div>

      {/* DETAILS */}
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

      {/* ACTIONS */}
      <div className="flex flex-col gap-2 text-sm">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="text-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-gray-500"
            >
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
              onClick={() => onDelete(product.id, product.image)}
              className="text-red-500"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
