export interface UserProfile {
  name: string;
  email: string;
  picture?: string;
  sub: string;
}

const USER_STORAGE_KEY = 'chakr_user_profile';
const CLIENT_ID_STORAGE_KEY = 'chakr_google_client_id';

// Default Client ID from Vite env or fallback
export const DEFAULT_GOOGLE_CLIENT_ID =
  (import.meta.env?.VITE_GOOGLE_CLIENT_ID as string) || '';

export function getStoredGoogleClientId(): string {
  const custom = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
  if (custom && custom.trim()) return custom.trim();
  return DEFAULT_GOOGLE_CLIENT_ID;
}

export function setStoredGoogleClientId(clientId: string): void {
  localStorage.setItem(CLIENT_ID_STORAGE_KEY, clientId.trim());
}

export function getStoredUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUserProfile(profile: UserProfile): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
}

export function clearStoredUserProfile(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function decodeJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode JWT:', e);
    return null;
  }
}
