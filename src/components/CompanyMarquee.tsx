import { companies } from '../data/about';

/**
 * Client logos directly under the hero: a cream band cutting into the dark
 * page, with the marks riding an endless marquee.
 *
 * The track carries the list twice. It animates 0 → -50%, so at the end of a
 * cycle the second copy sits exactly where the first one started and the loop
 * restarts with no visible seam — which only holds while the two copies stay
 * identical, so both are rendered from the same data.
 */
function Lane({ duplicate }: { duplicate?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={duplicate || undefined}>
      {companies.map((company) => (
        <span key={company.name} className="flex items-center">
          <img
            src={company.logo}
            // The duplicate is decorative — announcing every company twice is
            // what the aria-hidden lane is there to prevent.
            alt={duplicate ? '' : company.name}
            loading="lazy"
            decoding="async"
            style={{ height: company.height }}
            className={`w-auto max-w-none opacity-80 ${company.invert ? 'invert' : ''}`}
          />
          <span
            aria-hidden
            className="mx-[clamp(1.6rem,4vw,3.25rem)] inline-block h-2 w-2 rotate-45 bg-bg/25"
          />
        </span>
      ))}
    </div>
  );
}

export function CompanyMarquee() {
  return (
    <section aria-label="Some of the companies I've worked with" className="bg-bg">
      <div className="overflow-hidden bg-[#ECE9E4] pb-[clamp(2.5rem,6vw,5rem)] pt-[clamp(1.5rem,3.5vw,2.75rem)]">
        <p className="px-6 text-center font-sans text-[11px] font-light uppercase italic tracking-[0.18em] text-bg/70 sm:text-xs">
          Some of the companies I&apos;ve worked with
        </p>

        <div className="logo-marquee mt-[clamp(1.5rem,3.5vw,3rem)] overflow-hidden">
          <div className="logo-marquee-track flex w-max items-center">
            <Lane />
            <Lane duplicate />
          </div>
        </div>
      </div>
    </section>
  );
}
