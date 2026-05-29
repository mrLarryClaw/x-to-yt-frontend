import { Session, User } from '@/types';

const SESSION_KEY = 'x2yt_session';
const TOKEN_KEY = 'x2yt_token';
const USER_KEY = 'x2yt_user';

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function getUser(): User | null {
  const session = getSession();
  if (session?.user) return session.user;
  // Fallback: read from separate user store
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
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
  if (session.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function initSessionFromSearchParams(): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  
  // New flow: session_id from backend redirect
  const sessionId = params.get('session_id');
  const name = params.get('name');
  const email = params.get('email');
  const authStatus = params.get('auth');
  
  if (sessionId) {
    const user: User = {
      id: '',
      email: email || '',
      displayName: name || email || '',
      avatarUrl: '',
      isAllowed: true,
      emailVerified: true,
    };
    setSession({ token: sessionId, user });
    // Clean URL
    const url = new URL(window.location.href);
    url.searchParams.delete('session_id');
    url.searchParams.delete('name');
    url.searchParams.delete('email');
    url.searchParams.delete('auth');
    window.history.replaceState({}, '', url.toString());
    return;
  }
  
  // Legacy flow: token + user from URL params
  const token = params.get('token');
  const userRaw = params.get('user');
  if (token && userRaw) {
    try {
      const user = JSON.parse(decodeURIComponent(userRaw));
      setSession({ token, user });
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      url.searchParams.delete('user');
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore malformed
    }
  }
}