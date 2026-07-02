interface NavLink {
  label: string;
  href: string;
}

const LINKS: NavLink[] = [
  { label: 'Services', href: '#services' },
  { label: 'Case Studies', href: '#case-studies' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-bg/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-6 py-4 sm:justify-between">
        <span className="hidden font-display text-lg text-text sm:block">Alvin Wee</span>
        <ul className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          {LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="block rounded-full px-4 py-2 font-sans text-sm text-muted transition hover:text-accent"
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
