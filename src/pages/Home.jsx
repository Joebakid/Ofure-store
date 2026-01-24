import ProductCard from "../components/ProductCard";

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
    name: "Pink Crop Shirt",
    price: "15,000",
    category: "Shirts",
    description: "Soft, comfy & stylish",
    image:
      "https://images.unsplash.com/photo-1766465524306-b6c9c27d1b69?w=500&auto=format&fit=crop&q=60",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="section section-pad text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4">
          Glow. Heal. Feel Beautiful
        </h1>
        <p className="opacity-80 max-w-xl mx-auto text-sm sm:text-base">
          Wellness essentials and stylish fashion carefully selected
          to help you feel confident, healthy, and beautiful every day.
        </p>
      </section>

      {/* PRODUCTS PREVIEW */}
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
        {products.map((p, i) => (
          <ProductCard key={i} product={p} />
        ))}
      </section>

      {/* BRAND STORY */}
      <section className="section section-pad">
        <div className="bg-milk/70 rounded-[32px] p-6 sm:p-10 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            About Our Brand
          </h2>
          <p className="opacity-80 leading-relaxed text-sm sm:text-base">
            We believe self-care is not a luxury — it’s a lifestyle.
            Our store brings together trusted wellness products and
            carefully selected fashion pieces that fit seamlessly
            into your everyday life. Every product is chosen with
            quality, comfort, and confidence in mind.
          </p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section section-pad grid sm:grid-cols-2 gap-6">
        <div className="bg-lavender/50 rounded-[32px] p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-2">
            Forever Living Products
          </h3>
          <p className="text-sm opacity-80">
            Natural wellness products designed to support your health
            from the inside out.
          </p>
        </div>

        <div className="bg-peach/50 rounded-[32px] p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-2">
            Fashion & Shirts
          </h3>
          <p className="text-sm opacity-80">
            Comfortable, stylish pieces you can wear every day and
            still feel confident.
          </p>
        </div>
      </section>
    </>
  );
}
