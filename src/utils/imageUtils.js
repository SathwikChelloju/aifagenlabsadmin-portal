/**
 * Utility functions for image uploading, validation, and optimization
 */

export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/webp",
];

export function isImageFile(file) {
  if (!file) return false;
  if (file.type && file.type.startsWith("image/")) return true;
  const lowerName = (file.name || "").toLowerCase();
  return (
    lowerName.endsWith(".ico") ||
    lowerName.endsWith(".svg") ||
    lowerName.endsWith(".png") ||
    lowerName.endsWith(".jpg") ||
    lowerName.endsWith(".jpeg") ||
    lowerName.endsWith(".webp")
  );
}

/**
 * Reads and optionally scales down an image to max dimensions.
 * For SVGs: returns original data URL without rasterizing.
 * For raster images: if width/height exceed maxWidth/maxHeight, scales down proportionally via canvas.
 */
export function processImageFile(file, { maxWidth = 512, maxHeight = 512, quality = 0.92 } = {}) {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      reject(new Error("Selected file is not a supported image format."));
      return;
    }

    const isSvg = file.type === "image/svg+xml" || (file.name || "").toLowerCase().endsWith(".svg");

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (!dataUrl) {
        reject(new Error("Empty image data."));
        return;
      }

      // SVGs should remain untouched to preserve vector quality
      if (isSvg) {
        resolve(dataUrl);
        return;
      }

      // Load image to inspect dimensions
      const img = new Image();
      img.onerror = () => {
        // If image fails to load in Image element (e.g. some complex ICOs), fallback to raw data URL
        resolve(dataUrl);
      };
      img.onload = () => {
        const { width, height } = img;
        if (width <= maxWidth && height <= maxHeight) {
          // Already within target bounds
          resolve(dataUrl);
          return;
        }

        // Scale proportionally
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        const targetW = Math.max(1, Math.round(width * ratio));
        const targetH = Math.max(1, Math.round(height * ratio));

        try {
          const canvas = document.createElement("canvas");
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(dataUrl);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, targetW, targetH);

          const mimeType = file.type === "image/jpeg" ? "image/jpeg" : "image/png";
          const scaledDataUrl = canvas.toDataURL(mimeType, quality);
          resolve(scaledDataUrl);
        } catch {
          // Fallback to raw dataUrl on any canvas error
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}
