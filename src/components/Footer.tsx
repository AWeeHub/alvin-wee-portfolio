import { CONTACT_EMAIL, LINKEDIN_URL, mailtoUrl } from '../lib/contact';
import { AWeeLogo } from './AWeeLogo';
import { Reveal } from './Reveal';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bg px-6 py-10 text-center">
      <Reveal className="flex flex-col items-center">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent/70">
          // workflow complete — every lead accounted for
        </p>
        <AWeeLogo size="sm" />
        <p className="mt-3 font-mono text-xs text-muted">
          GoHighLevel Systems Builder — funnels, CRM, automation, and design.
        </p>

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:gap-8">
          <a
            href={mailtoUrl()}
            className="font-mono text-xs text-muted transition-colors duration-300 hover:text-accent"
          >
            {CONTACT_EMAIL}
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-muted transition-colors duration-300 hover:text-accent"
          >
            LinkedIn ↗
          </a>
        </div>

        <p className="mt-6 font-mono text-xs text-muted">
          © {new Date().getFullYear()} AWee Digital. All rights reserved.
        </p>
      </Reveal>
    </footer>
  );
}
