import Button from "./Button";
import { FaWhatsapp } from "react-icons/fa";
import { getWhatsAppLink } from "../../lib/whatsapp";

export default function Navbar() {
  const handleWhatsAppClick = () => {
    const link = getWhatsAppLink({
      name: "General Inquiry",
      price: "-",
      category: "Inquiry",
    });

    window.open(link, "_blank");
  };

  return (
    <header className="fixed top-3 sm:top-4 left-0 w-full z-50">
      <nav
        className="
          section
          flex items-center justify-between
          bg-milk/80 backdrop-blur-xl
          py-3 px-4 sm:px-6
          rounded-[32px]
          shadow-lg
        "
      >
        {/* Brand */}
        <div className="text-base sm:text-lg font-semibold">
          Ofure<span className="text-mauve">Shop</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex gap-6 text-sm">
          <a className="hover:text-mauve transition" href="#">
            Home
          </a>
          <a className="hover:text-mauve transition" href="#">
            Forever
          </a>
          <a className="hover:text-mauve transition" href="#">
            Shirts
          </a>
        </div>

        {/* WhatsApp CTA */}
        <Button icon={FaWhatsapp} onClick={handleWhatsAppClick}>
          WhatsApp
        </Button>
      </nav>
    </header>
  );
}
