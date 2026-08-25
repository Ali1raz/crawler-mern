import { auth } from '@clerk/nextjs/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000';

async function getTokenServer(): Promise<string | null> {
  const { getToken } = await auth();
  return getToken();
}

async function requestWithAuth<T>(
  fetchFn: (url: string, options: RequestInit) => Promise<Response>,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getTokenServer();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetchFn(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  async get<T>(path: string): Promise<T> {
    return requestWithAuth(fetch, path, { method: 'GET' });
  },

  async post<T>(path: string, body: unknown): Promise<T> {
    return requestWithAuth(fetch, path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async put<T>(path: string, body: unknown): Promise<T> {
    return requestWithAuth(fetch, path, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  async delete<T>(path: string): Promise<T> {
    return requestWithAuth(fetch, path, { method: 'DELETE' });
  },
};
