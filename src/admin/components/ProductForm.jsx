import { useState } from "react";
import { CATEGORIES } from "../utils/categories";

export default function ProductForm({ onCreate, loading }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    onCreate({
      name,
      price: Number(price),
      category,
      description,
      imageFile,
    });
  };

  return (
    <form className="bg-white p-6 rounded-2xl shadow mb-10 max-w-md mx-auto" onSubmit={handleSubmit}>
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
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        className="mb-4"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
      />

      <button
        disabled={loading}
        className="w-full bg-mauve text-white py-2 rounded"
      >
        {loading ? "Adding…" : "Add Product"}
      </button>
    </form>
  );
}
