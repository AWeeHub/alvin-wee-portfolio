import { useEffect, useState } from 'react';
import { AWeeLogo } from './AWeeLogo';

interface NavLink {
  label: string;
  href: string;
  id: string;
}

const LINKS: NavLink[] = [
  // The nav is wayfinding, not voice: it says the literal word a visitor scans
  // for. The band over the same section says THE BUILD — that one is the
  // editorial statement, and it can afford the flourish. ("Stack", which this
  // replaced, also collided with the toolkit in About.)
  { label: 'Symptoms', href: '#problem', id: 'problem' },
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Proof', href: '#case-studies', id: 'case-studies' },
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
      <nav className="flex items-center justify-center gap-xs px-gutter py-xs sm:justify-between">
        <div className="hidden items-center sm:flex">
          <AWeeLogo size="sm" />
        </div>

        {/* One row, always. Wrapped to two, the header grows past the sticky
            offset the pinned panels are anchored to and starts clipping their
            headings. */}
        <ul className="flex items-center justify-center gap-0.5 sm:gap-[clamp(1rem,2vw,2.5rem)]">
          {LINKS.map(({ label, href, id }) => (
            <li key={id}>
              <a
                href={href}
                className={`block whitespace-nowrap px-1.5 py-1 font-mono text-[clamp(0.5625rem,0.5rem+0.15vw,0.8125rem)] uppercase tracking-[0.1em] transition-colors duration-300 sm:px-2 sm:tracking-[0.22em] ${
                  active === id ? 'text-accent' : 'text-muted hover:text-text'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
