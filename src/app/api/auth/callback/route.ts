import { NextRequest, NextResponse } from 'next/server';

// Frontend base URL for redirects (not the API URL)
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://x-to-yt-frontend-production.up.railway.app';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error === 'access_denied' || !code) {
    return NextResponse.redirect(new URL('/?auth=rejected', FRONTEND_URL));
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  try {
    // Exchange code with backend
    const res = await fetch(`${apiUrl}/api/auth/google/callback?code=${encodeURIComponent(code)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body?.detail?.toLowerCase().includes('allow') || body?.detail?.toLowerCase().includes('not allowed')) {
        return NextResponse.redirect(new URL('/?auth=rejected', FRONTEND_URL));
      }
      return NextResponse.redirect(new URL('/?auth=error', FRONTEND_URL));
    }

    const data = await res.json();
    const sessionId = data?.session_id || data?.session?.token || data?.token || '';
    const user = data?.user || null;
    if (!sessionId) {
      return NextResponse.redirect(new URL('/?auth=error', FRONTEND_URL));
    }

    // Redirect to frontend home with success params
    const redirectUrl = new URL('/?auth=success', FRONTEND_URL);
    const response = NextResponse.redirect(redirectUrl);

    // Set session cookie
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(new URL('/?auth=error', FRONTEND_URL));
  }
}