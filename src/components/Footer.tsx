import { CONTACT_EMAIL, LINKEDIN_URL, mailtoUrl } from '../lib/contact';
import { AWeeLogo } from './AWeeLogo';

/**
 * A rule, the mark on the left, the ways to reach me on the right. The centred
 * stack this replaced piled five lines on top of each other and read as filler
 * under the contact section rather than the end of the page.
 *
 * Deliberately not wrapped in <Reveal>: it sits in the bottom sliver of the
 * page, below the scroll-trigger line, so a reveal here would never play — the
 * footer would simply stay invisible.
 */
export function Footer() {
  return (
    // Extra bottom padding on md+: that is where the fixed section bar sits, and
    // without the clearance it lies across the copyright line.
    <footer className="border-t border-white/10 bg-bg px-6 pb-10 pt-10 md:pb-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <AWeeLogo size="sm" />
          <p className="mt-3 max-w-sm font-mono text-xs leading-relaxed text-muted">
            GoHighLevel Systems Builder — funnels, CRM, automation, and design.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
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
          <p className="font-mono text-xs text-muted/70">
            © {new Date().getFullYear()} AWee Digital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
