export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-milk/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5">
        {/* 🌸 Spinning Loader */}
        <div className="relative w-14 h-14">
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-pink-300/60 blur-xl" />

          {/* Spinner */}
          <div className="relative w-14 h-14 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />
        </div>

        {/* Text */}
        <p className="text-sm tracking-wide text-mauve font-medium">
          Loading beautiful things…
        </p>
      </div>
    </div>
  );
}
