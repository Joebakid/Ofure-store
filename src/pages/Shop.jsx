import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";

import ProductCard from "../components/ProductCard";
import BackButton from "../components/BackButton";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";

const CATEGORIES = ["Shirts", "Forever"];
const ITEMS_PER_PAGE = 6;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    items,
    addItem,
    setOpen,
    cartEventId,
    cartMessage,
  } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);

  const [previewProduct, setPreviewProduct] = useState(null);

  /* ================= PARAMS ================= */
  const activeCategory =
    searchParams.get("category") || CATEGORIES[0];
  const currentPage = Number(searchParams.get("page")) || 1;

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Fetch error:", error);
        setLoading(false);
        return;
      }

      const withImages = data.map((p) => {
        if (!p.image) return { ...p, imageUrl: null };

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

    setToastVisible(true);
    const t = setTimeout(() => setToastVisible(false), 1600);
    return () => clearTimeout(t);
  }, [cartEventId, cartMessage]);

  function handleAddToCart(product) {
    addItem({
      name: product.name,
      price: product.price,
      image: product.imageUrl,
    });
  }

  /* ================= FILTER + PAGINATION ================= */
  const filteredProducts = useMemo(
    () => products.filter((p) => p.category === activeCategory),
    [products, activeCategory]
  );

  const totalPages = Math.ceil(
    filteredProducts.length / ITEMS_PER_PAGE
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function handlePageChange(page) {
    setSearchParams({ category: activeCategory, page });
  }

  function handleCategoryChange(cat) {
    setSearchParams({ category: cat, page: 1 });
  }

  return (
    <>
      {/* TOAST */}
      {toastVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-mauve text-white px-5 py-2 rounded-full shadow-lg text-sm">
          {cartMessage}
        </div>
      )}

      {/* IMAGE MODAL */}
      {previewProduct && (
        <div
          onClick={() => setPreviewProduct(null)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-4"
          >
            <img
              src={previewProduct.imageUrl}
              alt={previewProduct.name}
              className="w-full h-80 object-contain rounded-2xl"
            />

            <div className="mt-4 space-y-2">
              <h2 className="font-semibold">
                {previewProduct.name}
              </h2>

              <p className="text-sm text-gray-600">
                {previewProduct.description}
              </p>

              <p className="font-medium text-mauve">
                ₦{Number(previewProduct.price).toLocaleString()}
              </p>

              <button
                onClick={() => {
                  handleAddToCart(previewProduct);
                  setPreviewProduct(null);
                }}
                className="mt-2 w-full py-2 rounded-full bg-mauve text-white"
              >
                Add to cart
              </button>
            </div>
          </div>
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
      <section className="section flex gap-3 justify-center mb-10">
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
      {loading ? (
        <Loader />
      ) : (
        <>
          <section className="section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{ ...product, image: product.imageUrl }}
                onAdd={() => handleAddToCart(product)}
                onPreview={() => setPreviewProduct(product)}
              />
            ))}
          </section>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-12 pb-24"
          />
        </>
      )}
    </>
  );
}
