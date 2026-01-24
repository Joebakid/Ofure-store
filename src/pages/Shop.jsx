import { useSearchParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { FaArrowLeft } from "react-icons/fa";

const products = [
  {
    name: "Forever Aloe Vera Gel",
    price: "25,000",
    category: "Forever Living",
    description: "Supports digestion & immunity",
    image:
      "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Forever Bee Honey",
    price: "18,000",
    category: "Forever Living",
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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeCategory = searchParams.get("category") || "all";

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) =>
          activeCategory === "forever"
            ? p.category === "Forever Living"
            : p.category === "Shirts"
        );

  const setCategory = (cat) => {
    if (cat === "all") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <>
      {/* HEADER */}
      <section className="section section-pad flex items-center gap-4">
        {/* BACK */}
        <button
          onClick={() => navigate("/")}
          className="
            flex items-center gap-2
            text-sm
            hover:text-mauve
            transition
          "
        >
          <FaArrowLeft />
          Back
        </button>

        <h1 className="text-xl sm:text-2xl font-semibold ml-auto mr-auto">
          Store
        </h1>
      </section>

      {/* CATEGORY TABS */}
      <section className="section flex gap-3 justify-center mb-10">
        <button
          onClick={() => setCategory("all")}
          className={`
            px-5 py-2 rounded-full text-sm transition
            ${
              activeCategory === "all"
                ? "bg-mauve text-white shadow-lg"
                : "bg-peach/40 hover:bg-peach"
            }
          `}
        >
          All
        </button>

        <button
          onClick={() => setCategory("forever")}
          className={`
            px-5 py-2 rounded-full text-sm transition
            ${
              activeCategory === "forever"
                ? "bg-mauve text-white shadow-lg"
                : "bg-peach/40 hover:bg-peach"
            }
          `}
        >
          Forever
        </button>

        <button
          onClick={() => setCategory("shirts")}
          className={`
            px-5 py-2 rounded-full text-sm transition
            ${
              activeCategory === "shirts"
                ? "bg-mauve text-white shadow-lg"
                : "bg-peach/40 hover:bg-peach"
            }
          `}
        >
          Shirts
        </button>
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
        {filteredProducts.length === 0 ? (
          <p className="text-center opacity-70 col-span-full">
            No products found.
          </p>
        ) : (
          filteredProducts.map((p, i) => (
            <ProductCard key={i} product={p} />
          ))
        )}
      </section>
    </>
  );
}
