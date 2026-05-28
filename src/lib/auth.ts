import { Session, User } from '@/types';

const SESSION_KEY = 'x2yt_session';
const TOKEN_KEY = 'x2yt_token';

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    return parsed;
  } catch {
    return null;
  }
}

export function getUser(): User | null {
  const session = getSession();
  return session?.user || null;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function setSession(session: Session): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(TOKEN_KEY, session.token);
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function initSessionFromSearchParams(): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const userRaw = params.get('user');
  if (token && userRaw) {
    try {
      const user = JSON.parse(decodeURIComponent(userRaw));
      setSession({ token, user });
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      url.searchParams.delete('user');
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore malformed
    }
  }
}
