import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  if (!code) {
    return NextResponse.redirect(new URL('/?auth=error', request.url));
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  try {
    const res = await fetch(`${apiUrl}/api/auth/google/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body?.message?.toLowerCase().includes('allow') || body?.code === 'NOT_ALLOWED') {
        return NextResponse.redirect(new URL('/?auth=rejected', request.url));
      }
      return NextResponse.redirect(new URL('/?auth=error', request.url));
    }

    const data = await res.json();
    const token = data?.session?.token || data?.token || '';
    const user = data?.user || null;
    if (!token) {
      return NextResponse.redirect(new URL('/?auth=error', request.url));
    }

    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('token', token);
    redirectUrl.searchParams.set('user', encodeURIComponent(JSON.stringify(user)));
    return NextResponse.redirect(redirectUrl);
  } catch {
    return NextResponse.redirect(new URL('/?auth=error', request.url));
  }
}
