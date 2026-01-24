import { useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function CartToast() {
  const { isOpen } = useCart();

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => {}, 1500);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-mauve text-white px-4 py-3 rounded-full flex items-center gap-2 shadow-lg">
      <FaHeart />
      Added to cart
    </div>
  );
}
