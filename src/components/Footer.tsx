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
    <footer className="border-t border-white/10 bg-bg px-gutter pb-md pt-md md:pb-lg">
      <div className="mx-auto flex max-w-shell flex-col gap-md md:flex-row md:items-end md:justify-between">
        <div>
          <AWeeLogo size="md" />
          <p className="mt-xs max-w-[38ch] font-mono text-label leading-relaxed text-muted">
            GoHighLevel Systems Builder — funnels, CRM, automation, and design.
          </p>
        </div>

        <div className="flex flex-col gap-xs md:items-end">
          <div className="flex flex-wrap items-center gap-x-md gap-y-2xs">
            <a
              href={mailtoUrl()}
              className="font-mono text-label text-muted transition-colors duration-300 hover:text-accent"
            >
              {CONTACT_EMAIL}
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-label text-muted transition-colors duration-300 hover:text-accent"
            >
              LinkedIn ↗
            </a>
          </div>
          {/* Full muted, not muted/70: at this size the faded version lands at 3.6:1. */}
          <p className="font-mono text-label text-muted">
            © {new Date().getFullYear()} AWee Digital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
