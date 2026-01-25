import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";

import BackButton from "../components/BackButton";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

/* ================= CATEGORIES ================= */
const CATEGORIES = [
  "Shirts",
  "Forever Living Products",
];

const ITEMS_PER_PAGE = 8;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, addItem, setOpen, cartEventId, cartMessage } =
    useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);

  /* ================= PARAMS ================= */
  const activeCategory =
    searchParams.get("category") || CATEGORIES[0];

  const rawPage = Number(searchParams.get("page")) || 1;

  /* ================= FETCH ================= */
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const withImages = data.map((p) => {
        const { data: img } = supabase.storage
          .from("products")
          .getPublicUrl(p.image);

        return { ...p, imageUrl: img?.publicUrl };
      });

      setProducts(withImages);
      setLoading(false);
    }

    fetchProducts();
  }, []);

  /* ================= TOAST ================= */
  useEffect(() => {
    if (!cartEventId) return;

    setToastVisible(true);
    const t = setTimeout(() => setToastVisible(false), 1600);
    return () => clearTimeout(t);
  }, [cartEventId, cartMessage]);

  /* ================= FILTER + SORT ================= */
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.category === activeCategory)
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        })
      );
  }, [products, activeCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );

  const currentPage = Math.min(
    Math.max(rawPage, 1),
    totalPages
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ================= SCROLL (GLITCH FIX) ================= */
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, [currentPage, activeCategory]);

  /* ================= HANDLERS ================= */
  function handlePageChange(page) {
    if (page === currentPage) return;

    setSearchParams({
      category: activeCategory,
      page,
    });
  }

  function handleCategoryChange(cat) {
    if (cat === activeCategory) return;

    setSearchParams({
      category: cat,
      page: 1,
    });
  }

  function handleAddToCart(product) {
    addItem({
      name: product.name,
      price: product.price,
      image: product.imageUrl,
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* TOAST */}
      {toastVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-mauve text-white px-5 py-2 rounded-full shadow-lg text-sm">
          {cartMessage}
        </div>
      )}

      {/* HEADER */}
      <section className="app-container section-pad flex items-center">
        <BackButton to="/" />
        <h1 className="text-xl font-semibold mx-auto">Store</h1>

        <div className="flex gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-full text-sm bg-peach/50"
          >
            Admin
          </Link>

          <button
            onClick={() => setOpen(true)}
            disabled={!items.length}
            className={`px-4 py-2 rounded-full text-sm flex items-center gap-1 ${
              items.length
                ? "bg-mauve text-white"
                : "bg-peach/40 text-gray-400"
            }`}
          >
            <FaShoppingBag /> {items.length}
          </button>
        </div>
      </section>

      {/* CATEGORY */}
      <section className="section flex gap-3 justify-center mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
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
      <div className="flex-1">
        {loading ? (
          <Loader />
        ) : (
          <section className="section grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{ ...product, image: product.imageUrl }}
                onAdd={() => handleAddToCart(product)}
                onPreview={() => setPreviewProduct(product)}
              />
            ))}
          </section>
        )}
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="pb-20"
      />
    </div>
  );
}
