import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";


export default function BackButton({
  to = -1, // default = browser back
  label = "Back",
  className = "",
}) {
  const navigate = useNavigate();

  function handleBack() {
    navigate(to);
  }

  return (
  <button
    onClick={handleBack}
    className={`flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition ${className}`}
  >
    <HiArrowLeft className="text-lg" />
    <span>{label}</span>
  </button>
);

}
