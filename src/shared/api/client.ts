const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthToken = () => localStorage.getItem('authToken');

type FetchOptions = RequestInit & { auth?: boolean };

export const apiFetch = async <T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...options.headers,
  });

  if (options.auth) {
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    const errorBody = contentType.includes('application/json')
      ? await response.json().catch(() => null)
      : await response.text().catch(() => null);
    const message =
      (typeof errorBody === 'object' && errorBody && 'message' in errorBody)
        ? String((errorBody as { message?: string }).message || 'Request failed')
        : (typeof errorBody === 'string' && errorBody.trim().length > 0)
          ? errorBody
          : 'Request failed';
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }
  return (response.text() as unknown) as Promise<T>;
};
