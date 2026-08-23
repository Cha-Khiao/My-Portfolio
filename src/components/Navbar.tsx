'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = React.useState(false);

  if (pathname === '/admin/login') {
    return null;
  }

  const isHome = pathname === '/';
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-background/85 border-b border-border transition-colors duration-300">
        <div className="max-w-[920px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-outfit font-bold text-lg text-foreground tracking-tight hover:opacity-80 transition-opacity"
            aria-label="Home"
          >
            P.
          </Link>

          <div className="flex items-center gap-2">
            <ul className="hidden md:flex items-center gap-6 mr-4 list-none">
              <li>
                <Link
                  href={isHome ? '#about' : '/#about'}
                  className="text-sm font-medium text-fg-secondary hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href={isHome ? '#projects' : '/#projects'}
                  className="text-sm font-medium text-fg-secondary hover:text-foreground transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href={isHome ? '#certificates' : '/#certificates'}
                  className="text-sm font-medium text-fg-secondary hover:text-foreground transition-colors"
                >
                  Certificates
                </Link>
              </li>
              <li>
                <Link
                  href={isHome ? '#skills' : '/#skills'}
                  className="text-sm font-medium text-fg-secondary hover:text-foreground transition-colors"
                >
                  Skills
                </Link>
              </li>
              <li>
                <Link
                  href={isHome ? '#contact' : '/#contact'}
                  className="text-sm font-medium text-fg-secondary hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-fg-secondary hover:text-foreground transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-40 bg-background flex flex-col items-center justify-center gap-6 p-6 transition-colors duration-300">
          <Link
            href={isHome ? '#about' : '/#about'}
            onClick={closeMenu}
            className="text-lg font-medium text-fg-secondary hover:text-foreground"
          >
            About
          </Link>
          <Link
            href={isHome ? '#projects' : '/#projects'}
            onClick={closeMenu}
            className="text-lg font-medium text-fg-secondary hover:text-foreground"
          >
            Projects
          </Link>
          <Link
            href={isHome ? '#certificates' : '/#certificates'}
            onClick={closeMenu}
            className="text-lg font-medium text-fg-secondary hover:text-foreground"
          >
            Certificates
          </Link>
          <Link
            href={isHome ? '#skills' : '/#skills'}
            onClick={closeMenu}
            className="text-lg font-medium text-fg-secondary hover:text-foreground"
          >
            Skills
          </Link>
          <Link
            href={isHome ? '#contact' : '/#contact'}
            onClick={closeMenu}
            className="text-lg font-medium text-fg-secondary hover:text-foreground"
          >
            Contact
          </Link>
        </div>
      )}
    </>
  );
}
