import { Link } from "react-router-dom";
import BackButton from "../../components/BackButton";

export default function AdminHeader({ onLogout }) {
  return (
    <div className="py-10">
      <div className="flex items-center justify-between gap-4">
        {/* ⬅️ Back Button */}
        <BackButton to="/shop" />

        {/* RIGHT ACTIONS */}
        <div className="flex gap-3">
          {/* Analytics link */}
          <Link
            to="/admin/analytics"
            className="px-4 py-2 rounded-xl bg-mauve text-white text-sm hover:opacity-90"
          >
            Analytics
          </Link>

          <Link
  to="/admin/orders"
  className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm hover:opacity-90"
>
  Orders
</Link>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-pink-500 text-white text-sm hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
