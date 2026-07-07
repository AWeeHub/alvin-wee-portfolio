import { useEffect, useState } from 'react';
import { AWeeLogo } from './AWeeLogo';

interface NavLink {
  label: string;
  href: string;
  id: string;
}

const LINKS: NavLink[] = [
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'Case Studies', href: '#case-studies', id: 'case-studies' },
  { label: 'Process', href: '#process', id: 'process' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export function SiteHeader() {
  const [active, setActive] = useState('');

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.4;
      let current = '';
      for (const { id } of LINKS) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= mid) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-bg/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-6 py-4 sm:justify-between">
        <AWeeLogo size="sm" className="hidden sm:inline-flex" />
        <ul className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          {LINKS.map(({ label, href, id }) => (
            <li key={label}>
              <a
                href={href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 font-sans text-sm transition ${
                  active === id ? 'text-accent' : 'text-muted hover:text-accent'
                }`}
              >
                <span
                  aria-hidden
                  className={`h-1 w-1 rounded-full bg-accent transition-opacity duration-300 ${
                    active === id ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
