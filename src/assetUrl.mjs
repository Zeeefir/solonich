// A WordPress theme serves media from its own directory; Vercel uses the root.
export function assetUrl(path) {
  if (!path?.startsWith('/') || path.startsWith('//')) return path;
  const base = import.meta.env?.BASE_URL || globalThis.process?.env?.VITE_ASSET_BASE || '/';
  return `${base.replace(/\/$/, '')}${path}`;
}
