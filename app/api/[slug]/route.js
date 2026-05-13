import { NextResponse } from 'next/server';
import { getUrl } from '@/lib/shortener';

export async function GET(request, { params }) {
  const { slug } = params;
  const originalUrl = getUrl(slug);
  

  if (!originalUrl) {
    return NextResponse.json({ error: 'Short URL not found' }, { status: 404 });
  }

  // 307 = Temporary Redirect, preserves the HTTP method.
  // For analytics-tracking shorteners you might want 302 instead.
  return NextResponse.redirect(originalUrl, 307);
}
