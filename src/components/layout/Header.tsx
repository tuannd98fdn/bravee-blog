'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import SearchDialog from '../ui/SearchDialog';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { label: 'Blog', href: '/blog' },
  { label: 'Tutorials', href: '/tutorials' },
  { label: 'TIL', href: '/til' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => { document.body.classList.remove('no-scroll'); };
  }, [mobileOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
          <span className={styles.logoIcon}>B</span>
          <span className={styles.logoText}>
            Bravee<span className={styles.logoDot}>.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={`${styles.navLink} link-animated`}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <SearchDialog />
          <ThemeToggle />
          
          {/* Mobile Menu Button */}
          <button
            className={styles.menuBtn}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className={`${styles.menuLine} ${mobileOpen ? styles.menuLineOpen1 : ''}`} />
            <span className={`${styles.menuLine} ${mobileOpen ? styles.menuLineOpen2 : ''}`} />
            <span className={`${styles.menuLine} ${mobileOpen ? styles.menuLineOpen3 : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)}>
          <nav className={styles.mobileNav} onClick={(e) => e.stopPropagation()}>
            {NAV_ITEMS.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.mobileNavLink}
                onClick={() => setMobileOpen(false)}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
