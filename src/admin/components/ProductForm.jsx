import { useState } from "react";

const CATEGORIES = ["Shirts", "Forever"];

export default function ProductForm({ onCreate, loading }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("📝 form submit");

    onCreate({
      name,
      price: Number(price),
      category,
      description,
      imageFile,
    });
  };

  return (
 
 <form
      onSubmit={handleSubmit}
      className="bg-white  p-6 rounded-2xl shadow mb-10 max-w-md mx-auto"
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
          <option key={c}>{c}</option>
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
        onChange={(e) => {
          console.log("📁 file selected:", e.target.files[0]);
          setImageFile(e.target.files[0]);
        }}
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
