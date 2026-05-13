import {
  generateShortCode,
  isValidUrl,
  saveUrl,
  getUrl,
  _clearStore,
} from '@/lib/shortener';

// Runs before every single test in this file.
// Gives each test a clean, empty urlStore.
beforeEach(() => {
  _clearStore();
});

describe('generateShortCode', () => {
  test('returns a string of length 6', () => {
    const code = generateShortCode();
    expect(typeof code).toBe('string');
    expect(code).toHaveLength(6);
  });

  test('only conatins alphanumeric characters', () => {
    const code = generateShortCode();
    expect(code).toMatch(/^[a-zA-Z0-9]+$/);
  });

  test('generate different code on repeated calls', () => {
    const codes = new Set();
    for (let i = 0; i < 100; i++) {
      codes.add(generateShortCode());
    }
    // With 62^6 possibilities, 100 calls should produce 100 unique codes.
    // Allowing a tiny margin just in case.
    expect(codes.size).toBeGreaterThan(95);
  });
});

describe('isValidUrl', () => {
  test('accepts valid http urls', () => {
    expect(isValidUrl('http://example.com')).toBe(true);
  });

  test('accepts valid https URLs', () => {
    expect(isValidUrl('https://example.com/path?query=1')).toBe(true);
  });

  test('rejects empty strings', () => {
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl('   ')).toBe(false);
  });

  test('rejects non-string inputs', () => {
    expect(isValidUrl(null)).toBe(false);
    expect(isValidUrl(undefined)).toBe(false);
    expect(isValidUrl(123)).toBe(false);
  });

  test('rejects malformed URLs', () => {
    expect(isValidUrl('not a url')).toBe(false);
    expect(isValidUrl('example.com')).toBe(false); // missing protocol
  });

  test('rejects non-http(s) protocols for security', () => {
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
    expect(isValidUrl('ftp://example.com')).toBe(false);
    expect(isValidUrl('file:///etc/passwd')).toBe(false);
  });
});

describe('saveUrl', () => {
  test('returns a 6-character code for a valid URL', () => {
    const code = saveUrl('https://example.com');
    expect(code).toHaveLength(6);
  });

  test('stores the URL so it can be retrieved', () => {
    const code = saveUrl('https://example.com');
    expect(getUrl(code)).toBe('https://example.com');
  });
});

describe('getUrl', () => {
  test('returns undefined for unknown codes', () => {
    expect(getUrl('abc123')).toBeUndefined();
  });

  test('returns the original URL for known codes', () => {
    const code = saveUrl('https://github.com');
    expect(getUrl(code)).toBe('https://github.com');
  });
});
