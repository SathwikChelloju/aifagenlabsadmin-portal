/**
 * Dynamic Favicon & Title Synchronizer
 * Updates the document head icons (favicon, shortcut, apple-touch-icon)
 * and page title in real-time.
 */

export function updateFavicon(faviconUrl) {
  if (typeof document === "undefined") return;

  const url = faviconUrl || "/favicon.ico";

  // Remove existing icon links to force browser to repaint the tab icon
  const existingIcons = document.querySelectorAll(
    "link[rel='icon'], link[rel='shortcut icon'], link[rel*='icon'], link[rel='apple-touch-icon']"
  );
  existingIcons.forEach((el) => el.remove());

  const isSvg = url.startsWith("data:image/svg") || url.endsWith(".svg");
  const isIco = url.endsWith(".ico") || url.startsWith("data:image/x-icon") || url.startsWith("data:image/vnd.microsoft.icon");
  const mimeType = isSvg ? "image/svg+xml" : isIco ? "image/x-icon" : "image/png";

  // Create standard icon link
  const link = document.createElement("link");
  link.type = mimeType;
  link.rel = "icon";
  link.href = url;
  document.head.appendChild(link);

  // Create shortcut icon link
  const shortcutLink = document.createElement("link");
  shortcutLink.rel = "shortcut icon";
  shortcutLink.type = mimeType;
  shortcutLink.href = url;
  document.head.appendChild(shortcutLink);

  // Create apple-touch-icon link
  const appleLink = document.createElement("link");
  appleLink.rel = "apple-touch-icon";
  appleLink.href = isIco ? "/apple-touch-icon.png" : url;
  document.head.appendChild(appleLink);
}

export function updateDocumentTitle(title) {
  if (typeof document === "undefined") return;
  document.title = title || "AIFA GEN LABS Admin Portal";
}
