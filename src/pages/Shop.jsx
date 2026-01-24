import { useEffect, useState } from "react";
import {
  useSearchParams,
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";
import { FaArrowLeft, FaShoppingBag } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import Loader from "../components/Loader";

const CATEGORIES = ["Shirts", "Forever"];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    items,
    addItem,
    setOpen,
    cartEventId,
    cartMessage,
  } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔔 toast visibility (driven ONLY by cartEventId)
  const [toastVisible, setToastVisible] = useState(false);

  const activeCategory =
    searchParams.get("category") || CATEGORIES[0];

  const isAdminRoute = location.pathname.startsWith("/admin");

  /* ================= FETCH ================= */
  useEffect(() => {
    async function fetchProducts() {
      console.log("📦 Fetching products");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Fetch error:", error);
        return;
      }

      const withImages = data.map((p) => {
        const { data: img } = supabase.storage
          .from("products")
          .getPublicUrl(p.image);

        return { ...p, imageUrl: img.publicUrl };
      });

      setProducts(withImages);
      setLoading(false);
    }

    fetchProducts();
  }, []);

  /* ================= TOAST ================= */
  useEffect(() => {
    if (!cartEventId) return;

    console.log("🔔 Toast fired:", cartEventId, cartMessage);

    setToastVisible(true);
    const t = setTimeout(() => setToastVisible(false), 1600);
    return () => clearTimeout(t);
  }, [cartEventId, cartMessage]);

  /* ================= ADD ================= */
  const handleAddToCart = (product) => {
    console.log("🟢 Add clicked:", product.name);

    addItem({
      name: product.name,
      price: product.price, // number is fine
      image: product.imageUrl, // FULL URL (important)
    });
  };

  /* ================= UI ================= */
  return (
    <>
      {/* 🔔 TOAST */}
      {toastVisible && (
        <div
          key={cartEventId}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                     bg-mauve text-white px-5 py-2
                     rounded-full shadow-lg text-sm"
        >
          {cartMessage}
        </div>
      )}

      {/* HEADER */}
      <section className="section section-pad flex items-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm"
        >
          <FaArrowLeft /> Back
        </button>

        <h1 className="text-xl font-semibold mx-auto">Store</h1>

        <div className="flex gap-3">
          {/* ✅ ADMIN LINK RESTORED */}
          <Link
            to="/admin"
            className="px-4 py-2 rounded-full text-sm bg-peach/50 hover:bg-peach"
          >
            Admin
          </Link>

          <button
            onClick={() => setOpen(true)}
            disabled={items.length === 0}
            className={`px-4 py-2 rounded-full text-sm flex items-center gap-1 ${
              items.length === 0
                ? "bg-peach/40 text-gray-400"
                : "bg-mauve text-white"
            }`}
          >
            <FaShoppingBag /> {items.length}
          </button>
        </div>
      </section>

      {/* CATEGORY */}
      <section className="section flex gap-3 justify-center mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSearchParams({ category: cat })}
            className={`px-5 py-2 rounded-full text-sm ${
              activeCategory === cat
                ? "bg-mauve text-white"
                : "bg-peach/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* PRODUCTS */}
      {loading ? (
        <Loader />
      ) : (
        <section className="section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
          {products
            .filter((p) => p.category === activeCategory)
            .map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  image: product.imageUrl,
                }}
                onAdd={() => handleAddToCart(product)}
              />
            ))}
        </section>
      )}
    </>
  );
}
