import { NextRequest, NextResponse } from 'next/server';
import { setAdminSession, clearAdminSession, getAdminSession, refreshAdminSession } from '@/lib/auth';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json(session);
}

export async function PUT() {
  const session = await refreshAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ authenticated: false, error: 'Session expired' }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, email: session.email, message: 'Session refreshed' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'กรุณาระบุอีเมลและรหัสผ่าน' }, { status: 400 });
    }

    const client = supabaseAdmin || supabase;
    if (!isSupabaseConfigured || !client) {
      return NextResponse.json(
        { error: 'Supabase ยังไม่ได้เชื่อมต่อใน Environment Variables' },
        { status: 500 }
      );
    }

    // Authenticate with Supabase Auth
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.session || !data.user) {
      console.error('[Auth Error] Supabase rejected login:', error?.message || 'No session returned');
      return NextResponse.json(
        { error: error?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Check Admin Email Whitelist
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && data.user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'บัญชีนี้ไม่มีสิทธิ์เข้าถึงส่วนผู้ดูแลระบบ (Admin Only)' },
        { status: 403 }
      );
    }

    // Save Supabase access token & refresh token in secure HttpOnly cookies
    await setAdminSession(data.session.access_token, data.session.refresh_token);

    return NextResponse.json({
      success: true,
      email: data.user.email,
      message: 'เข้าสู่ระบบสำเร็จ',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout failed');
    }
  }
  await clearAdminSession();
  return NextResponse.json({ success: true, message: 'ออกจากระบบสำเร็จ' });
}
