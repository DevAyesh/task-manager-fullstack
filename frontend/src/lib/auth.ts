const TOKEN_KEY = 'task_app_token';

// A simple cookie-based token store. Cookies (rather than localStorage) let
// the Next.js middleware read the token on the server to protect routes.
export function saveToken(token: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=86400`;
}

export function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_KEY}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearToken() {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}
