import Button from "./Button";
import { FaShoppingBag, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-4 left-0 w-full z-50 pointer-events-none">
      <nav
        className="
          pointer-events-auto
          mx-auto
          w-[30%] max-w-sm min-w-[220px]
          flex items-center justify-between
          bg-milk/70 backdrop-blur-2xl
          px-4 py-2
          rounded-full
          shadow-[0_8px_30px_rgba(0,0,0,0.06)]
        "
      >
        {/* Logo Icon */}
        <button
          onClick={() => navigate("/")}
          className="
            w-9 h-9
            flex items-center justify-center
            rounded-full
            bg-white/60
            text-mauve
            hover:scale-105 transition
          "
        >
          <FaRegHeart size={14} />
        </button>

        {/* Cart */}
        <Button
          icon={FaShoppingBag}
          onClick={() => navigate("/cart")}
          className="
            !px-3 !py-2
            text-xs
            rounded-full
          "
        >
          Cart
        </Button>
      </nav>
    </header>
  );
}
