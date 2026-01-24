import { FaArrowRight, FaRegSadTear } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <section className="section min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-peach/40 text-mauve">
          <FaRegSadTear size={24} />
        </div>

        {/* Text */}
        <h1 className="text-2xl sm:text-3xl font-semibold mb-3">
          Page not found
        </h1>
        <p className="text-sm opacity-70 mb-8">
          This page doesn’t exist, but something beautiful is waiting for you in
          the store.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate("/shop")}
          className="
            inline-flex items-center gap-2
            px-6 py-3
            rounded-full
            bg-mauve text-white
            text-sm
            hover:opacity-90
            transition
          "
        >
          Go to Store
          <FaArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}
