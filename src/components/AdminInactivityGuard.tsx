'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Clock, RefreshCw, LogOut } from 'lucide-react';

interface InactivityGuardProps {
  timeoutMinutes?: number; // Total idle timeout (default: 20 minutes)
  warningSeconds?: number; // Warning time before auto logout (default: 60 seconds)
  children: React.ReactNode;
}

export function AdminInactivityGuard({
  timeoutMinutes = 20,
  warningSeconds = 60,
  children,
}: InactivityGuardProps) {
  const router = useRouter();
  const [showWarning, setShowWarning] = React.useState(false);
  const [countdown, setCountdown] = React.useState(warningSeconds);

  const timeoutMs = timeoutMinutes * 60 * 1000;
  const warningMs = Math.max(1000, (timeoutMinutes * 60 - warningSeconds) * 1000);

  const warningTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const logoutTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleLogout = React.useCallback(async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
    } catch (e) {
      console.warn('Auto logout fetch failed');
    }
    setShowWarning(false);
    router.push('/admin/login');
  }, [router]);

  const resetTimers = React.useCallback(() => {
    // Clear existing timers
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    setShowWarning(false);
    setCountdown(warningSeconds);

    // Set Warning Timer (Triggers countdown dialog before auto logout)
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(warningSeconds);

      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, warningMs);

    // Set Final Hard Logout Timer
    logoutTimerRef.current = setTimeout(() => {
      handleLogout();
    }, timeoutMs);
  }, [handleLogout, timeoutMs, warningMs, warningSeconds]);

  // Listen to active user interactions
  React.useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];

    const handleUserActivity = () => {
      // If warning modal is not currently open, reset the idle timer
      if (!showWarning) {
        resetTimers();
      }
    };

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Initialize timers on mount
    resetTimers();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [resetTimers, showWarning]);

  return (
    <>
      {children}

      {/* Discreet Warning Modal before auto-logout */}
      {showWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto shadow-inner">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <h3 className="font-outfit text-base font-bold text-foreground">
                ไม่มีการใช้งานนานเกินไป
              </h3>
              <p className="text-xs text-fg-secondary mt-1.5 leading-relaxed">
                ระบบจะออกจากระบบอัตโนมัติเพื่อความปลอดภัยใน{' '}
                <span className="font-bold text-amber-500 font-mono text-sm">{countdown}</span> วินาที
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-tag-bg hover:bg-border text-fg-secondary text-xs font-medium transition-colors flex items-center justify-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> ออกจากระบบ
              </button>
              <button
                type="button"
                onClick={() => resetTimers()}
                className="btn-primary flex-1 py-2.5 text-xs font-semibold shadow-md flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> ใช้งานต่อ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
