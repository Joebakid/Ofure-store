export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div
          className="
            w-12 h-12
            rounded-full
            border-4 border-peach
            border-t-mauve
            animate-spin
          "
        />
        <p className="text-sm opacity-70">
          Loading beautiful things…
        </p>
      </div>
    </div>
  );
}
