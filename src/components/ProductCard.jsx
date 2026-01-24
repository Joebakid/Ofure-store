import Button from "./Button";
import ImageWithLoader from "./ImageWithLoader";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      className="
        bg-peach/40
        rounded-[32px]
        p-4 sm:p-5
        shadow-xl
        hover:-translate-y-2
        transition-all duration-300
      "
    >
      <div className="mb-4 h-48 sm:h-56">
        <ImageWithLoader
          src={product.image}
          alt={product.name}
        />
      </div>

      <h3 className="text-base sm:text-lg font-semibold mb-1">
        {product.name}
      </h3>

      <p className="text-sm opacity-80 mb-2">
        {product.description}
      </p>

      <p className="font-semibold mb-3">
        ₦{product.price}
      </p>

      <Button onClick={() => navigate("/shop")}>
        View in Store
      </Button>
    </div>
  );
}
