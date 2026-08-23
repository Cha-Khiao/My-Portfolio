'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Clock, RefreshCw, LogOut } from 'lucide-react';

interface InactivityGuardProps {
  timeoutMinutes?: number; // Total idle timeout (default: 20 minutes)
  warningSeconds?: number; // Warning time before auto logout (default: 60 seconds)
  renderTimer?: boolean;
}

export function AdminInactivityGuard({
  timeoutMinutes = 20,
  warningSeconds = 60,
  renderTimer = true,
}: InactivityGuardProps) {
  const router = useRouter();
  const totalSeconds = timeoutMinutes * 60;

  const [remainingSeconds, setRemainingSeconds] = React.useState(totalSeconds);
  const [showWarning, setShowWarning] = React.useState(false);
  const [justReset, setJustReset] = React.useState(false);

  const lastActivityRef = React.useRef<number>(Date.now());
  const isLoggedOutRef = React.useRef<boolean>(false);

  const handleLogout = React.useCallback(async () => {
    if (isLoggedOutRef.current) return;
    isLoggedOutRef.current = true;
    try {
      await fetch('/api/auth', { method: 'DELETE' });
    } catch (e) {
      console.warn('Auto logout fetch failed');
    }
    setShowWarning(false);
    window.location.href = '/admin/login?reason=timeout';
  }, []);

  const resetTimer = React.useCallback(() => {
    lastActivityRef.current = Date.now();
    setRemainingSeconds(totalSeconds);
    setShowWarning(false);
    setJustReset(true);
    setTimeout(() => setJustReset(false), 1500);
  }, [totalSeconds]);

  // Main countdown tick loop (checks actual elapsed time with Date.now())
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (isLoggedOutRef.current) return;

      const elapsedMs = Date.now() - lastActivityRef.current;
      const elapsedSec = Math.floor(elapsedMs / 1000);
      const left = Math.max(0, totalSeconds - elapsedSec);

      setRemainingSeconds(left);

      // Trigger warning dialog when under warning threshold
      if (left <= warningSeconds && left > 0) {
        setShowWarning(true);
      } else if (left > warningSeconds) {
        setShowWarning(false);
      }

      // Hard timeout reached
      if (left <= 0) {
        clearInterval(interval);
        handleLogout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [totalSeconds, warningSeconds, handleLogout]);

  // Activity listeners (auto-resets whenever user moves mouse, types, clicks, or refocuses tab)
  React.useEffect(() => {
    let lastThrottled = 0;

    const handleUserActivity = () => {
      if (isLoggedOutRef.current) return;
      const now = Date.now();
      // Throttle activity event processing to once every 2 seconds
      if (now - lastThrottled > 2000) {
        lastThrottled = now;
        const elapsed = (now - lastActivityRef.current) / 1000;
        // If user was away but not yet logged out, moving or focusing automatically resets the timer!
        if (elapsed < totalSeconds) {
          lastActivityRef.current = now;
          setRemainingSeconds(totalSeconds);
          setShowWarning(false);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        const elapsed = (now - lastActivityRef.current) / 1000;
        if (elapsed >= totalSeconds) {
          handleLogout();
        } else {
          // User returned before timeout expired -> restart timer automatically!
          lastActivityRef.current = now;
          setRemainingSeconds(totalSeconds);
          setShowWarning(false);
        }
      }
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click', 'focus'];
    events.forEach((evt) => window.addEventListener(evt, handleUserActivity, { passive: true }));
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleUserActivity));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [totalSeconds, handleLogout]);

  // Format MM:SS
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Visual status classes based on remaining time
  const isUrgent = remainingSeconds <= warningSeconds;
  const isWarning = remainingSeconds <= 300 && !isUrgent; // <= 5 min

  let badgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 hover:border-emerald-500/40';
  let dotColor = 'bg-emerald-500';

  if (isUrgent) {
    badgeColor = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/40 animate-pulse';
    dotColor = 'bg-rose-500';
  } else if (isWarning) {
    badgeColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
    dotColor = 'bg-amber-500';
  }

  return (
    <>
      {renderTimer && (
        <div
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all shadow-sm ${badgeColor}`}
          title="เซสชันผู้ดูแลระบบจะเริ่มนับเวลาใหม่ทันทีเมื่อมีการขยับหรือกลับเข้ามาที่หน้าเว็บ (หรือกดไอคอนรีเฟรชเพื่อต่อเวลาได้ทันที)"
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
          </span>
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold tracking-wider text-xs sm:text-sm">{formattedTime}</span>
            <span className="text-[11px] opacity-80 whitespace-nowrap">
              {justReset ? 'รีเซ็ตเวลาแล้ว!' : 'เซสชัน'}
            </span>
          </div>
          <button
            type="button"
            onClick={resetTimer}
            className="p-1 -mr-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-inherit transition-all active:scale-90 cursor-pointer"
            title="กดเพื่อต่อเวลาเซสชันทันที (+20 นาที)"
            aria-label="ต่อเวลาเซสชัน"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${justReset ? 'rotate-180 text-emerald-500' : ''} transition-transform duration-500`} />
          </button>
        </div>
      )}

      {/* Discreet Warning Modal when only 60s remain */}
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
                <span className="font-bold text-rose-500 font-mono text-sm">{remainingSeconds}</span> วินาที
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-md cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> ออกจากระบบ
              </button>
              <button
                type="button"
                onClick={resetTimer}
                className="btn-primary flex-1 py-2.5 text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> ใช้งานต่อ (+20 นาที)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

