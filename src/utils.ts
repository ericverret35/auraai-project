
/**
 * Helper for authenticated API calls with JWT token
 */
export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = (window as any).aura_auth_token;
  const headers = {
    ...options.headers as any,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
  return fetch(url, { ...options, headers });
}
