export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-full text-sm
          bg-peach/40 text-gray-600
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-peach/70 transition"
      >
        ←
      </button>

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-full text-sm transition
            ${
              page === currentPage
                ? "bg-pink-400 text-white shadow"
                : "bg-peach/30 text-gray-700 hover:bg-peach/60"
            }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-full text-sm
          bg-peach/40 text-gray-600
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-peach/70 transition"
      >
        →
      </button>
    </div>
  );
}
