import { Wrench, Briefcase, Workflow, MessageSquare, type LucideIcon } from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

const LINKS: NavLink[] = [
  { label: 'Services', href: '#services', icon: Wrench },
  { label: 'Case Studies', href: '#case-studies', icon: Briefcase },
  { label: 'Process', href: '#process', icon: Workflow },
  { label: 'Contact', href: '#contact', icon: MessageSquare },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-bg/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-6 py-4 sm:justify-between">
        <span className="hidden font-display text-lg text-text sm:block">Alvin Wee</span>
        <ul className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          {LINKS.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                className="flex items-center gap-2 rounded-full px-4 py-2 font-sans text-sm text-muted transition hover:text-accent"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
