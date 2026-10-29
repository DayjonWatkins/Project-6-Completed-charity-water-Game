/**
 * Resolves static asset paths relative to the Vite base URL.
 * Ensures images load correctly whether deployed at root (/)
 * or a GitHub Pages repository subpath (/repo-name/).
 */
export const getAssetUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = import.meta.env.BASE_URL || './';
  const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${prefix}${cleanPath}`;
};
