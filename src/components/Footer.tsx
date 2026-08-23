'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return null;
  }

  return (
    <footer className="border-t border-border py-8 px-6 text-center text-xs text-fg-tertiary transition-colors duration-300">
      <div className="max-w-[920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2026 Prasopphol Talhom</p>
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-xs text-fg-tertiary hover:text-fg-secondary transition-colors"
            title="Management"
          >
            Me
          </Link>
        </div>
      </div>
    </footer>
  );
}
