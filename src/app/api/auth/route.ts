import { NextRequest, NextResponse } from 'next/server';
import { setAdminSession, clearAdminSession, isAuthenticated, getAdminSession } from '@/lib/auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json(session);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'กรุณาระบุอีเมลและรหัสผ่าน' }, { status: 400 });
    }

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { error: 'Supabase ยังไม่ได้เชื่อมต่อใน Environment Variables' },
        { status: 500 }
      );
    }

    // Authenticate with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.session || !data.user) {
      return NextResponse.json(
        { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
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

    // Save Supabase access token in secure HttpOnly cookie
    await setAdminSession(data.session.access_token);

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
