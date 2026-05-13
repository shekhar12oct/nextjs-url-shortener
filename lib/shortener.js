// Why globalThis? In Next.js dev mode (especially with Turbopack), modules
// can be re-evaluated between requests, which would wipe a normal module-level
// Map. Attaching it to globalThis keeps the same Map across reloads and
// across separate module instances used by different route handlers.
const urlStore = globalThis.__urlStore ?? new Map()
if (!globalThis.__urlStore) {
  globalThis.__urlStore = urlStore
  console.log('🔵 urlStore initialized on globalThis')
}

/**
 * Generates a random 6-character alphanumeric code.
 * Example: "a3Kp9X"
 */

export function generateShortCode() {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Validates whether a string is a proper HTTP/HTTPS URL.
 * Returns true/false instead of throwing — easier to use in forms.
 */

export function isValidUrl(url) {
  if (typeof url !== 'string' || url.trim() === '') {
    return false;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}


/**
 * Saves a URL and returns its short code.
 * Throws if the URL is invalid.
 */

export function saveUrl(originalUrl){
    if(!isValidUrl(originalUrl)) throw new Error('Invalid URL');
    const code = generateShortCode();
    urlStore.set(code,originalUrl);
    return code;
}

/**
 * Looks up the original URL for a short code.
 * Returns undefined if not found.
 */

export function getUrl(code){
return urlStore.get(code);
}


/**
 * Test helper — clears all stored URLs.
 * Lets tests start with a clean slate.
 */

export function _clearStore(){
    urlStore.clear();
}