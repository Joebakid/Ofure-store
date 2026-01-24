export function normalizeImagePath(image) {
  if (!image) return null;

  if (image.startsWith("http")) {
    const split = image.split("/products/");
    return split[1] ? decodeURIComponent(split[1]) : null;
  }

  return image;
}
