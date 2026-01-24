import { useState } from "react";

export default function ImageWithLoader({
  src,
  alt,
  className = "",
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-[24px] bg-lavender/40">
      {/* Skeleton */}
      {!loaded && (
        <div
          className="
            absolute inset-0
            animate-pulse
            bg-gradient-to-r
            from-lavender/40
            via-peach/40
            to-lavender/40
          "
        />
      )}

      {/* Image */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`
          w-full h-full object-cover
          transition-opacity duration-500
          ${loaded ? "opacity-100" : "opacity-0"}
          ${className}
        `}
      />
    </div>
  );
}
