import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

async function request(
  method: string,
  path: string,
  body?: unknown
): Promise<{ success: boolean; message: string; body?: unknown }> {
  try {
    const response = await axiosClient.request({
      method,
      url: path,
      data: body,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { message } = error.response.data ?? {};
      throw new Error(message || 'Request failed', { cause: error });
    }
    throw new Error('Network error', { cause: error });
  }
}

export const api = {
  get: (path: string) => request('GET', path),
  post: (path: string, body: unknown) => request('POST', path, body),
  patch: (path: string, body: unknown) => request('PATCH', path, body),
  delete: (path: string) => request('DELETE', path),
};

// ------------------------------------------------------------------
// Profile API – uses public/data/user.json
// ------------------------------------------------------------------

export interface UserProfile {
  fullName: string;
  email: string;
  memberSince: string;
  phone?: string;
  city?: string;
}

// In-memory cache (updated on save)
let cachedUser: UserProfile | null = null;

/**
 * Fetch the current user's profile from the public JSON file.
 * If fetch fails, use hardcoded fallback.
 */
export const fetchUserProfile = async (): Promise<UserProfile> => {
  if (cachedUser) {
    return { ...cachedUser };
  }

  try {
    const response = await fetch('/data/user.json');
    if (!response.ok) throw new Error('Failed to fetch user data');
    const data = await response.json();
    cachedUser = data as UserProfile;
    return { ...data };
  } catch (error) {
    console.warn('Using fallback user data:', error);
    const fallback: UserProfile = {
      fullName: 'Ada Okafor',
      email: 'ada@gmail.com',
      memberSince: 'FEB 2026',
      phone: '080345',
      city: 'Lagos',
    };
    cachedUser = fallback;
    return { ...fallback };
  }
};

/**
 * Update the current user's profile (in-memory only; file is read-only).
 */
export const updateUserProfile = async (
  data: Partial<UserProfile>
): Promise<UserProfile> => {
  // Simulate async update
  await new Promise((resolve) => setTimeout(resolve, 500));

  const current = cachedUser || (await fetchUserProfile());
  const updated = { ...current, ...data };
  cachedUser = updated;
  return { ...updated };

  // When backend is ready, uncomment:
  // const response = await api.patch('/profile-settings', data);
  // if (!response.success) throw new Error(response.message || 'Update failed');
  // return response.body as UserProfile;
};