import { AWeeLogo } from './AWeeLogo';
import { Reveal } from './Reveal';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bg px-6 py-10 text-center">
      <Reveal className="flex flex-col items-center">
        <AWeeLogo size="sm" />
        <p className="mt-3 font-mono text-xs text-muted">
          GoHighLevel Systems Builder — funnels, CRM, automation, and design.
        </p>
        <p className="mt-4 font-mono text-xs text-muted">
          © {new Date().getFullYear()} AWee Digital. All rights reserved.
        </p>
      </Reveal>
    </footer>
  );
}
