import { Wrench, Briefcase, Workflow, MessageSquare, type LucideIcon } from 'lucide-react';

interface NavPill {
  label: string;
  href: string;
  icon: LucideIcon;
}

const PILLS: NavPill[] = [
  { label: 'Services', href: '#services', icon: Wrench },
  { label: 'Case Studies', href: '#case-studies', icon: Briefcase },
  { label: 'Process', href: '#process', icon: Workflow },
  { label: 'Contact', href: '#contact', icon: MessageSquare },
];

export function HeroNavPills() {
  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-3">
      {PILLS.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 font-sans text-sm text-text transition hover:border-accent/50 hover:text-accent"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
        </a>
      ))}
    </nav>
  );
}
