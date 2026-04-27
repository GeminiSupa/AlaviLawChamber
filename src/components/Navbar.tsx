'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { label: 'Home',      href: '#home' },
  { label: 'Services',  href: '#expertise' },
  { label: 'About',     href: '#about' },
  { label: 'Team',      href: '#team' },
  { label: 'Gallery',   href: '#gallery' },
  { label: 'Blog',      href: '#blogs' },
  { label: 'Reviews',   href: '#testimonials' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [active, setActive]       = useState('#home');
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      const sections = document.querySelectorAll('section[id]');
      sections.forEach(s => {
        const top = s.getBoundingClientRect().top;
        if (top <= 100 && top > -s.clientHeight + 100) {
          setActive(`#${s.id}`);
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    
    // If we are on a blog page, redirect to home first
    if (pathname !== '/') {
      router.push(`/${href}`);
      return;
    }

    const el = document.querySelector(href);
    if (el) {
      const offset = navRef.current?.offsetHeight ?? 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav ref={navRef} className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        <a href="#home" className="logo" onClick={e => { e.preventDefault(); scrollTo('#home'); }}>
          <span className="logo-main">ALAVI</span>
          <span className="logo-sub">LAW CHAMBER</span>
        </a>

        <button
          className={`menu-toggle${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        <ul className={`nav-menu${menuOpen ? ' open' : ''}`}>
          {navItems.map(item => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`nav-link${active === item.href ? ' active' : ''}`}
                onClick={e => { e.preventDefault(); scrollTo(item.href); }}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="btn-primary nav-btn"
              onClick={e => { e.preventDefault(); scrollTo('#contact'); }}
            >
              Consultation
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
