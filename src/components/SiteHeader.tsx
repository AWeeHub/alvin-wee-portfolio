import { useEffect, useState } from 'react';
import { AWeeLogo } from './AWeeLogo';

interface NavLink {
  index: string;
  label: string;
  href: string;
  id: string;
}

// Numbers match the status bar's node map, so the nav and the bar name a
// section the same way.
const LINKS: NavLink[] = [
  { index: '01', label: 'Condition', href: '#problem', id: 'problem' },
  { index: '02', label: 'Stack', href: '#services', id: 'services' },
  { index: '03', label: 'Operator', href: '#about', id: 'about' },
  { index: '04', label: 'Proof', href: '#case-studies', id: 'case-studies' },
  { index: '05', label: 'Goal', href: '#contact', id: 'contact' },
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
      <nav className="flex items-center justify-center gap-2 px-6 py-3 sm:justify-between">
        <div className="hidden items-center sm:flex">
          <AWeeLogo size="sm" />
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-1 sm:gap-6">
          {LINKS.map(({ index, label, href, id }) => (
            <li key={id}>
              <a
                href={href}
                className={`group flex items-baseline gap-1 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors duration-300 ${
                  active === id ? 'text-accent' : 'text-muted hover:text-text'
                }`}
              >
                {/* white/55 is the floor that still clears 4.5:1 on #05070A —
                    anything dimmer reads nicer but fails contrast. */}
                <span className={active === id ? 'text-accent' : 'text-white/55'}>
                  {index}/
                </span>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
