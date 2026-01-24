import { useState } from "react";
import ProductCard from "../components/ProductCard";

const products = [
  {
    name: "Forever Aloe Vera Gel",
    price: "25,000",
    category: "Forever",
    description: "Supports digestion & immunity",
    image:
      "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Forever Bee Honey",
    price: "18,000",
    category: "Forever",
    description: "Natural energy & immunity booster",
    image:
      "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Pink Crop Shirt",
    price: "15,000",
    category: "Shirts",
    description: "Soft, comfy & stylish",
    image:
      "https://images.unsplash.com/photo-1766465524306-b6c9c27d1b69?w=500&auto=format&fit=crop&q=60",
  },
];

export default function Shop() {
  const [activeTab, setActiveTab] = useState("Forever");

  const filtered = products.filter(
    (p) => p.category === activeTab
  );

  return (
    <>
      {/* HEADER */}
      <section className="section section-pad text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-3">
          Our Store
        </h1>
        <p className="opacity-80">
          Explore our wellness products and fashion collection
        </p>
      </section>

      {/* TABS */}
      <section className="section flex justify-center gap-3 mb-10">
        {["Forever", "Shirts"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-6 py-2 rounded-full text-sm
              transition-all
              ${
                activeTab === tab
                  ? "bg-mauve text-white shadow-lg"
                  : "bg-peach/40 hover:bg-peach"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </section>

      {/* PRODUCTS */}
      <section
        className="
          section
          grid grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-6
          pb-24
        "
      >
        {filtered.map((p, i) => (
          <ProductCard key={i} product={p} />
        ))}
      </section>
    </>
  );
}
