import { cookies } from 'next/headers';
import { supabase, supabaseAdmin, isSupabaseConfigured } from './supabase';

const COOKIE_NAME = 'portfolio_admin_token';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

export interface AdminUserSession {
  authenticated: boolean;
  email?: string;
  userId?: string;
}

/**
 * Verify whether the current user is authenticated as an Admin.
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return false;

  // Supabase Auth Session verification
  const client = supabaseAdmin || supabase;
  if (isSupabaseConfigured && client) {
    try {
      const { data, error } = await client.auth.getUser(token);
      if (error || !data.user) {
        return false;
      }

      // If ADMIN_EMAIL is set in .env, strictly verify that the logged-in email matches!
      if (ADMIN_EMAIL && data.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  return false;
}

/**
 * Get details of current authenticated admin session.
 */
export async function getAdminSession(): Promise<AdminUserSession> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return { authenticated: false };

  const client = supabaseAdmin || supabase;
  if (isSupabaseConfigured && client) {
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
      return { authenticated: false };
    }
  }

  return { authenticated: false };
}

/**
 * Set the admin authentication cookie session (7 days validity).
 */
export async function setAdminSession(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && Boolean(process.env.VERCEL),
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/**
 * Clear the admin session cookie on logout.
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
