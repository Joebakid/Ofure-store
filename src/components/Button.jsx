export default function Button({ children, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className="
        bg-gradient-to-r from-blush to-mauve
        text-white
        px-6 py-3
        rounded-[var(--radius-btn)]
        shadow-lg
        hover:-translate-y-1
        transition-all duration-300
        text-sm sm:text-base
        flex items-center gap-2
      "
    >
      {Icon && <Icon className="text-lg" />}
      {children}
    </button>
  );
}
