const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Fetch from the backend inside a Server Component. Returns null on any failure
 * (network error, 404, bad payload) so pages can render a clear empty or not-found state.
 */
export async function apiGet<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    const body = await res.json();
    return body.success ? (body.data as T) : null;
  } catch {
    return null;
  }
}
