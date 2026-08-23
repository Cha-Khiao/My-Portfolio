import { cookies } from 'next/headers';
import { supabase, supabaseAdmin, isSupabaseConfigured } from './supabase';

const COOKIE_NAME = 'portfolio_admin_token';
const REFRESH_COOKIE_NAME = 'portfolio_admin_refresh_token';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

export interface AdminUserSession {
  authenticated: boolean;
  email?: string;
  userId?: string;
}

/**
 * Helper to set cookies with standard options
 */
async function setSessionCookies(token: string, refreshToken?: string) {
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && Boolean(process.env.VERCEL),
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  };

  cookieStore.set(COOKIE_NAME, token, cookieOptions);
  if (refreshToken) {
    cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, cookieOptions);
  }
}

/**
 * Verify whether the current user is authenticated as an Admin.
 * Automatically attempts session refresh if access token expired.
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  if (!token && !refreshToken) return false;

  const client = supabaseAdmin || supabase;
  if (!isSupabaseConfigured || !client) return false;

  // 1. Try validating current access token
  if (token) {
    try {
      const { data, error } = await client.auth.getUser(token);
      if (!error && data.user) {
        if (ADMIN_EMAIL && data.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
          return false;
        }
        return true;
      }
    } catch (e) {
      // Fall through to refresh token attempt
    }
  }

  // 2. If access token expired or failed, attempt auto-refresh using refresh_token
  if (refreshToken) {
    try {
      const { data, error } = await client.auth.refreshSession({ refresh_token: refreshToken });
      if (!error && data.session && data.user) {
        if (ADMIN_EMAIL && data.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
          return false;
        }
        // Save fresh tokens to cookies
        await setSessionCookies(data.session.access_token, data.session.refresh_token);
        return true;
      }
    } catch (e) {
      return false;
    }
  }

  return false;
}

/**
 * Get details of current authenticated admin session.
 * Automatically refreshes expired tokens.
 */
export async function getAdminSession(): Promise<AdminUserSession> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  if (!token && !refreshToken) return { authenticated: false };

  const client = supabaseAdmin || supabase;
  if (!isSupabaseConfigured || !client) return { authenticated: false };

  // 1. Try validating current access token
  if (token) {
    try {
      const { data, error } = await client.auth.getUser(token);
      if (!error && data.user) {
        if (ADMIN_EMAIL && data.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
          return { authenticated: false };
        }
        return {
          authenticated: true,
          email: data.user.email,
          userId: data.user.id,
        };
      }
    } catch (e) {
      // Fall through to refresh
    }
  }

  // 2. Attempt refresh
  if (refreshToken) {
    try {
      const { data, error } = await client.auth.refreshSession({ refresh_token: refreshToken });
      if (!error && data.session && data.user) {
        if (ADMIN_EMAIL && data.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
          return { authenticated: false };
        }
        await setSessionCookies(data.session.access_token, data.session.refresh_token);
        return {
          authenticated: true,
          email: data.user.email,
          userId: data.user.id,
        };
      }
    } catch (e) {
      return { authenticated: false };
    }
  }

  return { authenticated: false };
}

/**
 * Explicitly refresh and extend the admin authentication session.
 */
export async function refreshAdminSession(): Promise<AdminUserSession> {
  return await getAdminSession();
}

/**
 * Set the admin authentication cookie session (7 days validity).
 */
export async function setAdminSession(token: string, refreshToken?: string): Promise<void> {
  await setSessionCookies(token, refreshToken);
}

/**
 * Clear the admin session cookies on logout.
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
}
