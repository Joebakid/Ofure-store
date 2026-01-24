import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const products = [
  {
    name: "Forever Aloe Vera Gel",
    price: "25000",
    category: "Forever Living",
    description: "Supports digestion & immunity",
    image:
      "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Pink Crop Shirt",
    price: "15000",
    category: "Shirts",
    description: "Soft, comfy & stylish",
    image:
      "https://images.unsplash.com/photo-1766465524306-b6c9c27d1b69?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Forever Bright Toothgel",
    price: "18000",
    category: "Forever Living",
    description: "Gentle whitening & fresh breath care",
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&auto=format&fit=crop&q=60",
  },
];


export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      {/* 🌸 PAGE CONTAINER */}
      <div className="w-full max-w-6xl px-6">
        {/* HERO */}
        <section className="pt-20 pb-16 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">
            Glow. Heal. Feel Beautiful
          </h1>

          <p className="opacity-80 max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
            Wellness essentials and stylish fashion carefully selected
            to help you feel confident, healthy, and beautiful every day.
          </p>

          {/* 💖 VISIT STORE BUTTON */}
          <button
            onClick={() => navigate("/shop")}
            className="
              px-10 py-3
              rounded-full
              bg-gradient-to-r from-mauve to-lavender
              text-white text-sm font-medium
              shadow-lg
              hover:scale-[1.02]
              hover:shadow-xl
              transition
            "
          >
            Visit Store
          </button>
        </section>

        {/* 🛍 PRODUCTS PREVIEW */}
        <section className="pb-24">
          <h2 className="text-center text-lg font-semibold mb-10 opacity-80">
            Featured Picks
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p, i) => (
              <ProductCard key={i} product={p} />
            ))}
          </div>
        </section>

        {/* 🌷 BRAND STORY */}
        <section className="pb-24">
          <div className="bg-milk/80 rounded-[36px] p-8 sm:p-12 border shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">
              About Our Brand
            </h2>
            <p className="opacity-80 leading-relaxed text-sm sm:text-base max-w-3xl mx-auto">
              We believe self-care is not a luxury — it’s a lifestyle.
              Our store brings together trusted wellness products and
              carefully selected fashion pieces that fit seamlessly
              into your everyday life. Every product is chosen with
              quality, comfort, and confidence in mind.
            </p>
          </div>
        </section>

        {/* 🎀 CATEGORIES */}
        <section className="pb-32 grid sm:grid-cols-2 gap-8">
          <div className="bg-lavender/40 rounded-[32px] p-8 shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">
              Forever Living Products
            </h3>
            <p className="text-sm opacity-80 leading-relaxed">
              Natural wellness products designed to support your health
              from the inside out.
            </p>
          </div>

          <div className="bg-peach/40 rounded-[32px] p-8 shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">
              Fashion & Shirts
            </h3>
            <p className="text-sm opacity-80 leading-relaxed">
              Comfortable, stylish pieces you can wear every day and
              still feel confident.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
