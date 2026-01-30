import { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FaShoppingBag, FaTimes } from "react-icons/fa";

import BackButton from "../components/BackButton";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

// ✅ Analytics
import { EVENTS } from "../analytics/analyticsEvents";
import { logEvent } from "../analytics/analyticsClient";

/* ================= CONFIG ================= */
const CATEGORIES = ["Shirts", "Forever Living Products"];
const ITEMS_PER_PAGE = 8;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, addItem, setOpen, cartEventId, cartMessage } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);

  const lastViewedRef = useRef(null);

  /* ================= PARAMS ================= */
  const activeCategory =
    searchParams.get("category") || CATEGORIES[0];

  const rawPage = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("q") ?? "";

  /* ================= FETCH ================= */
  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (!mounted) return;

      if (error) {
        console.error("❌ Product fetch error:", error);
        setProducts([]);
        setLoading(false);
        return;
      }

      const safeData = Array.isArray(data) ? data : [];

      const withImages = safeData.map((p) => {
        if (!p.image) return { ...p, imageUrl: null };

        const { data: img } = supabase.storage
          .from("products")
          .getPublicUrl(p.image);

        return { ...p, imageUrl: img?.publicUrl || null };
      });

      setProducts(withImages);
      setLoading(false);
    }

    fetchProducts();
    return () => (mounted = false);
  }, []);

  /* ================= TOAST ================= */
  useEffect(() => {
    if (!cartEventId) return;
    setToastVisible(true);
    const t = setTimeout(() => setToastVisible(false), 1600);
    return () => clearTimeout(t);
  }, [cartEventId, cartMessage]);

  /* ================= FILTER ================= */
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.category === activeCategory)
      .filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        })
      );
  }, [products, activeCategory, searchQuery]);

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

  /* ================= SCROLL ================= */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, activeCategory, searchQuery]);

  /* ================= HANDLERS ================= */
  function handlePageChange(page) {
    if (page === currentPage) return;

    const next = { category: activeCategory, page };
    if (searchQuery) next.q = searchQuery;

    setSearchParams(next);
  }

  function handleCategoryChange(cat) {
    if (cat === activeCategory) return;
    setSearchParams({ category: cat, page: 1 });
  }

  function handleSearchChange(value) {
    const next = { category: activeCategory, page: 1 };
    if (value) next.q = value;
    setSearchParams(next);
  }

  function clearSearch() {
    setSearchParams({ category: activeCategory, page: 1 });
  }

  function handleAddToCart(product) {
    addItem({
      name: product.name,
      price: product.price,
      image: product.imageUrl,
    });
  }

  function handlePreview(product) {
    setPreviewProduct(product);

    if (lastViewedRef.current === product.id) return;
    lastViewedRef.current = product.id;

    logEvent(EVENTS.PRODUCT_VIEW, {
      productId: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
    });
  }

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* FLOATING CART */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-mauve text-white flex items-center justify-center shadow-xl"
      >
        <FaShoppingBag size={20} />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>

      {/* TOAST */}
      {toastVisible && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 bg-mauve text-white px-5 py-2 rounded-full text-sm">
          {cartMessage}
        </div>
      )}

      {/* HEADER */}
      <section className="app-container section-pad flex items-center">
        <BackButton to="/" />
        <h1 className="text-xl font-semibold mx-auto">Store</h1>
        <Link to="/admin" className="px-4 py-2 rounded-full text-sm bg-peach/50">
          Admin
        </Link>
      </section>

      {/* SEARCH */}
      <section className="section flex justify-center mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2 pr-10 rounded-full border"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <FaTimes size={12} />
            </button>
          )}
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
        ) : paginatedProducts.length === 0 ? (
          <p className="text-center opacity-60">No products found.</p>
        ) : (
          <section className="section grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{ ...product, image: product.imageUrl }}
                onAdd={() => handleAddToCart(product)}
                onPreview={() => handlePreview(product)}
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
        className="pb-32"
      />

      {/* ================= PREVIEW MODAL ================= */}
      {previewProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
          onClick={() => setPreviewProduct(null)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewProduct(null)}
              className="absolute top-3 right-3 text-gray-500"
            >
              <FaTimes />
            </button>

            {previewProduct.imageUrl && (
              <img
                src={previewProduct.imageUrl}
                alt={previewProduct.name}
                className="w-full max-h-80 object-contain rounded-lg mb-4 "
              />
            )}

       <h2 className="text-lg font-semibold mb-1">
  {previewProduct.name}
</h2>

<p className="text-sm opacity-70 mb-2">
  {previewProduct.category}
</p>

{/* DESCRIPTION */}
{previewProduct.description && (
  <p className="text-sm leading-relaxed opacity-80 mb-4">
    {previewProduct.description}
  </p>
)}

<p className="font-semibold mb-4">
  ₦{previewProduct.price}
</p>


            <button
              onClick={() => {
                handleAddToCart(previewProduct);
                setPreviewProduct(null);
              }}
              className="w-full py-2 rounded-full bg-mauve text-white"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
