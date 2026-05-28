import { Job, CreateJobRequest, JobStatus, ApiError, User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('x2yt_token');
}

async function fetchWithAuth(path: string, options: RequestInit = {}): Promise<Response> {
  const url = `${API_URL}${path}`;
  const token = getToken();
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Content-Type', 'application/json');
  return fetch(url, { ...options, headers });
}

function handleError(response: Response): Promise<never> {
  return response.json().catch(() => null).then((body) => {
    const err: ApiError = {
      message: body?.message || `Request failed with status ${response.status}`,
      code: body?.code,
    };
    throw err;
  });
}

export async function getMe(): Promise<User> {
  const res = await fetchWithAuth('/api/me');
  if (!res.ok) return handleError(res);
  return res.json();
}

export async function createJob(payload: CreateJobRequest): Promise<Job> {
  const res = await fetchWithAuth('/api/jobs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) return handleError(res);
  return res.json();
}

export async function getJobs(): Promise<Job[]> {
  const res = await fetchWithAuth('/api/jobs');
  if (!res.ok) return handleError(res);
  return res.json();
}

export async function getJob(id: string): Promise<Job> {
  const res = await fetchWithAuth(`/api/jobs/${id}`);
  if (!res.ok) return handleError(res);
  return res.json();
}

export async function retryJob(id: string): Promise<Job> {
  const res = await fetchWithAuth(`/api/jobs/${id}/retry`, {
    method: 'POST',
  });
  if (!res.ok) return handleError(res);
  return res.json();
}

export async function deleteJob(id: string): Promise<void> {
  const res = await fetchWithAuth(`/api/jobs/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) return handleError(res);
}

export async function logout(): Promise<void> {
  const res = await fetchWithAuth('/api/auth/logout', { method: 'POST' });
  if (!res.ok) return handleError(res);
}

export function isValidXUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    if (host !== 'x.com' && host !== 'twitter.com') return false;
    const pathPattern = /\/\w+\/status\/\d+/;
    return pathPattern.test(parsed.pathname);
  } catch {
    return false;
  }
}

export function buildStartAuthUrl(): string {
  return `${API_URL}/api/auth/google/start`;
}

export { API_URL };
