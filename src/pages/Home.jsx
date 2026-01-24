import { useNavigate } from "react-router-dom";
import { BsStars } from "react-icons/bs";
import { HiHeart } from "react-icons/hi";

const products = [
  {
    name: "Forever Aloe Vera Gel",
    category: "Forever Living",
    description: "Supports digestion & immunity",
    image:
      "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Pink Crop Shirt",
    category: "Shirts",
    description: "Soft, comfy & stylish",
    image:
      "https://images.unsplash.com/photo-1766465524306-b6c9c27d1b69?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Forever Bright Toothgel",
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
      <div className="w-full max-w-6xl px-6">

        {/* 🌈 LOGO HEADER */}
        <div className="pt-10 pb-6 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="
              group flex items-center gap-3
              px-6 py-3 rounded-full
              bg-white/70 backdrop-blur
              shadow-md hover:shadow-xl
              transition hover:scale-[1.03]
            "
          >
            {/* Icon bubble */}
            <div className="
              w-11 h-11 rounded-full
              bg-gradient-to-br from-mauve to-lavender
              flex items-center justify-center
              text-white text-xl shadow
              group-hover:rotate-12 transition
            ">
              <BsStars />
            </div>

            {/* Brand text */}
            <div className="text-left leading-tight">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-lg tracking-tight">
                  LiveOutLoud
                </h1>

                {/* LOL Badge */}
                <span className="
                  text-[10px] px-2 py-0.5 rounded-full
                  bg-peach/60 font-medium
                ">
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
        <section className="pt-10 pb-16 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">
            Glow. Heal. Feel Beautiful
          </h1>

          <p className="opacity-80 max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
            Wellness essentials and stylish fashion carefully selected
            to help you feel confident, healthy, and beautiful every day.
          </p>

          <button
            onClick={() => navigate("/shop")}
            className="
              px-10 py-3 rounded-full
              bg-gradient-to-r from-mauve to-lavender
              text-white text-sm font-medium
              shadow-lg hover:scale-[1.02]
              hover:shadow-xl transition
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
              <div
                key={i}
                className="
                  bg-peach/30
                  rounded-3xl
                  p-4
                  shadow-md
                  hover:shadow-xl
                  transition
                  hover:-translate-y-1
                  cursor-pointer
                "
                onClick={() => navigate("/shop")}
              >
                {/* Image */}
                <div className="overflow-hidden rounded-2xl mb-4">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-52 object-cover hover:scale-105 transition"
                    loading="lazy"
                  />
                </div>

                {/* Category */}
                <span className="
                  inline-block mb-2
                  text-[11px]
                  px-3 py-1 rounded-full
                  bg-lavender/50
                  font-medium
                ">
                  {p.category}
                </span>

                {/* Name */}
                <h3 className="font-semibold mb-1">
                  {p.name}
                </h3>

                {/* Description */}
                <p className="text-sm opacity-70 leading-relaxed">
                  {p.description}
                </p>
              </div>
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
