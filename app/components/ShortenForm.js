'use client';

import { useState } from 'react';

export default function ShortenForm() {
  // Form state: what the user has typed
  const [url, setUrl] = useState('');

  // Result state: what the API returned
  const [shortUrl, setShortUrl] = useState('');

  // UI state: are we waiting for the API? Did something go wrong?
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); // stop the browser from reloading the page

    // Reset previous result/error before a new attempt
    setError('');
    setShortUrl('');
    setLoading(true);

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (!response.ok) {
        // The API returned a 4xx/5xx — show its error message
        setError(data.error || 'Something went wrong');
      } else {
        setShortUrl(data.shortUrl);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full max-w-xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center text-blue-600'>URL Shortener</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-3 text-black-100'>
        <input
          type='text'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder='Paste a long URL here...'
          aria-label='URL to shorten'
          className='border border-gray-300 rounded px-4 py-2'
          disabled={loading}
        />
        <button
          type='submit'
         // disabled={loading || url.trim() === ''}
          className='bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
        >
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </form>

      {error && (
        <p role='alert' className='mt-4 text-red-600 text-center'>
          {error}
        </p>
      )}

      {shortUrl && (
        <div className='mt-4 p-4 bg-green-50 border border-green-200 rounded text-center'>
          <p className='text-sm text-gray-600 mb-1'>Your short URL:</p>
          <a
            href={shortUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 font-mono break-all hover:underline'
          >
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}
