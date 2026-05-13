import { NextResponse } from 'next/server';
import { saveUrl } from '@/lib/shortener';

export async function POST(request) {
  let body;

  // Parse the JSON body. If it's malformed, return 400.
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { url } = body;

  // Try to save. saveUrl() throws if the URL is invalid.
  try {
    const code = saveUrl(url);

    // Build the full short URL using the request's own origin.
    // This way it works on localhost AND in production without config.
    const origin = request.nextUrl.origin;
    const shortUrl = `${origin}/${code}`;

    return NextResponse.json({ shortUrl, code }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
