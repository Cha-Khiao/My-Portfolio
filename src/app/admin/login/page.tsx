'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, X, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';

function AdminLoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isTimeout = searchParams.get('reason') === 'timeout';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง');
      }

      // Hard redirect to ensure fresh cookies and bypass soft navigation cache
      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message || 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 min-h-screen w-full flex items-center justify-center p-4 bg-background">
      <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Red Tactile X Close Button in Top-Right Corner */}
        <Link
          href="/"
          className="btn-close-modal absolute top-4 right-4 w-8 h-8"
          aria-label="Back to Home"
          title="ปิด / กลับสู่หน้าแรก"
        >
          <X className="w-4 h-4" />
        </Link>

        <div className="mb-6 text-center pt-1">
          <div className="w-12 h-12 rounded-2xl bg-tag-bg border border-border flex items-center justify-center text-accent mx-auto mb-3 shadow-inner">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-outfit text-xl font-bold text-foreground tracking-tight">Admin Portal</h1>
        </div>

        {isTimeout && !error && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>เซสชันหมดอายุเนื่องจากไม่มีการใช้งานนานเกิน 20 นาที กรุณาเข้าสู่ระบบใหม่อีกครั้ง</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-accent text-sm outline-none transition-colors placeholder:text-fg-tertiary"
              />
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-fg-tertiary" />
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-accent text-sm outline-none transition-colors placeholder:text-fg-tertiary"
              />
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-fg-tertiary" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 text-sm font-semibold shadow-md disabled:opacity-50 mt-2"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={null}>
      <AdminLoginForm />
    </React.Suspense>
  );
}

