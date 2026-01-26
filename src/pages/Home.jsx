import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsStars } from "react-icons/bs";
import { HiHeart } from "react-icons/hi";
import gsap from "gsap";

import { supabase } from "../lib/supabase";
import Loader from "../components/Loader";

// ✅ Analytics
import { EVENTS } from "../analytics/analyticsEvents";
import { logEvent } from "../analytics/analyticsClient";

/* ================= FEATURED PRODUCT NAMES ================= */
const FEATURED_PRODUCT_NAMES = [
  "Forever Arctic Sea",
  "Forever Bright Toothgel",
  "Black and White Short-sleeve AxePeak Jersey",
];

export default function Home() {
  const navigate = useNavigate();
  const root = useRef(null);

  const [products, setProducts] = useState([]);
  const [ready, setReady] = useState(false);

  /* ================= USER VISIT ANALYTICS ================= */
  useEffect(() => {
    logEvent(EVENTS.USER_VISIT, {
      page: window.location.pathname,
    });
  }, []);

  /* ================= FETCH FEATURED PRODUCTS ================= */
  useEffect(() => {
    async function fetchFeaturedProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("name", FEATURED_PRODUCT_NAMES);

      if (error) {
        console.error("❌ Home fetch error:", error);
        setProducts([]);
        setReady(true);
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

      // Small delay to avoid animation paint race
      setTimeout(() => setReady(true), 300);
    }

    fetchFeaturedProducts();
  }, []);

  /* ================= GSAP ================= */
  useLayoutEffect(() => {
    if (!ready || !root.current) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .from(".logo", {
          y: -30,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        })
        .from(
          ".hero > *",
          {
            y: 30,
            opacity: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .from(
          ".card",
          {
            y: 40,
            opacity: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.2"
        );
    }, root);

    return () => ctx.revert();
  }, [ready]);

  /* ================= LOADER GATE ================= */
  if (!ready) {
    return <Loader />;
  }

  return (
    <main ref={root} className="w-full bg-milk">
      <div className="max-w-6xl mx-auto px-6">
        {/* LOGO */}
        <div className="logo pt-10 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-mauve to-lavender flex items-center justify-center text-white">
              <BsStars />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold">LiveOutLoud</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-peach">
                  LOL
                </span>
              </div>
              <p className="text-[11px] opacity-70 flex items-center gap-1">
                Express your glow <HiHeart className="text-pink-400" />
              </p>
            </div>
          </button>
        </div>

        {/* HERO */}
        <section className="hero pt-16 pb-24 text-center">
          <h1 className="text-4xl lg:text-5xl font-semibold mb-6">
            Glow. Heal. Feel Beautiful
          </h1>

          <p className="max-w-xl mx-auto opacity-80 mb-10">
            Wellness essentials and stylish fashion carefully selected
            to help you feel confident, healthy, and beautiful every day.
          </p>

          <button
            onClick={() => navigate("/shop")}
            className="px-10 py-3 rounded-full bg-gradient-to-r from-mauve to-lavender text-white shadow"
          >
            Visit Store
          </button>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="pb-32">
          <h2 className="text-center text-lg font-semibold mb-14">
            Featured Picks
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((p) => (
              <div
                key={p.id}
                className="card bg-peach/30 rounded-3xl p-4 shadow cursor-pointer"
                onClick={() => navigate("/shop")}
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-56 object-cover rounded-2xl mb-4"
                />

                <span className="inline-block mb-2 text-xs px-3 py-1 rounded-full bg-lavender/50">
                  {p.category}
                </span>

                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm opacity-70">{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BRAND */}
        <section className="pb-32">
          <div className="bg-white rounded-[36px] p-10 text-center shadow">
            <h2 className="text-2xl font-semibold mb-4">
              About Our Brand
            </h2>
            <p className="max-w-3xl mx-auto opacity-80">
              Self-care is not a luxury — it’s a lifestyle. We curate
              wellness and fashion pieces that fit seamlessly into your
              everyday life.
            </p>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="pb-32 grid sm:grid-cols-2 gap-10">
          <div className="bg-lavender/40 rounded-3xl p-8 text-center shadow">
            <h3 className="font-semibold mb-2">
              Forever Living Products
            </h3>
            <p className="text-sm opacity-80">
              Natural wellness products designed to support your health.
            </p>
          </div>

          <div className="bg-peach/40 rounded-3xl p-8 text-center shadow">
            <h3 className="font-semibold mb-2">Fashion & Shirts</h3>
            <p className="text-sm opacity-80">
              Comfortable, stylish pieces you can wear every day.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
