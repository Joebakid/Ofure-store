export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-milk/60 z-50">
      <div className="flex flex-col items-center gap-5">
        {/* 💗 Heart Glow */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-pink-300 blur-2xl opacity-70 animate-pulse" />
          <div className="relative flex items-center justify-center w-16 h-16">
            <span className="text-4xl animate-bounce">💖</span>
          </div>
        </div>

        <p className="text-sm tracking-wide text-mauve font-medium">
          Loading beautiful things…
        </p>
      </div>
    </div>
  );
}
