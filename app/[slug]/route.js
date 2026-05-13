import { NextResponse } from 'next/server';
import { getUrl } from '@/lib/shortener';

export async function GET(_request, { params }) {
  const { slug } = await params;
  const originalUrl = getUrl(slug);

if (!originalUrl) {
    return NextResponse.json({ error: 'Short URL not found' }, { status: 404 });
  }

  return NextResponse.redirect(originalUrl, 307);
}
