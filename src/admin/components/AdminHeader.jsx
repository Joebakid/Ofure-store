export default function AdminHeader({ onLogout }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-semibold text-mauve">Admin Products</h1>

      <button
        onClick={onLogout}
        className="px-4 py-2 rounded-xl bg-pink-500 text-white text-sm"
      >
        Logout
      </button>
    </div>
  );
}
