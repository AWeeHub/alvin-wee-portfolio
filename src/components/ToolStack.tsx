import { useEffect, useRef, useState } from 'react';
import { toolkit } from '../data/about';

/** Extra room the hovered card opens up in the cards after it. The lifted card
 *  is already on top, so this is air, not legibility. */
const SPREAD = 32;
/** Card width, as a share of the deck, with a floor and a ceiling: narrower than
 *  the floor and the name won't fit; wider than the ceiling and the deck reads as
 *  a row of panels rather than a stack. */
const CARD_MIN = 190;
const CARD_MAX = 280;
const CARD_SHARE = 0.24;
/**
 * The strip each stacked card leaves showing has to hold the logo, the kind, and
 * the name. Measured, not guessed: the widest name ("GoHighLevel") sets 84px and
 * the card's own padding another 21px, so ~105px is the point where a stacked
 * card still reads. A tablet leaves 63px, which is why its deck was eight cards
 * clipping each other's labels.
 */
const STRIP_MIN = 100;

/**
 * The toolkit as a squared-up deck: cards overlap in one direction, the card
 * under the cursor lifts and the rest step aside to let it open.
 *
 * The geometry is derived from the deck's measured width rather than hard-coded,
 * so the fan fills the column at any viewport — at 2560px the old fixed 220/110
 * left the deck stranded in the left third of the row.
 *
 * Transform-only — nothing here animates width, margin, or position — so a hover
 * costs the compositor one frame and the layout holds at any zoom.
 */
export function ToolStack() {
  const [active, setActive] = useState<number | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // Measured on a plain wrapper, not on the deck itself: the deck only exists
  // when there is room for it, and something has to be there to ask.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(frame);
    return () => ro.disconnect();
  }, []);

  const card = Math.min(CARD_MAX, Math.max(CARD_MIN, width * CARD_SHARE));
  // The last card's right edge lands on the deck's right edge — with SPREAD held
  // back, so a hover near the end still has somewhere to push into.
  const reveal =
    toolkit.length > 1 ? Math.max(0, (width - card - SPREAD) / (toolkit.length - 1)) : 0;
  // A deck needs width to fan, and how much width is a question about this many
  // cards at this size — not about a breakpoint. Under the floor, the cards go
  // out as a plain grid, where every name is legible and hovering is not the
  // only way to read one.
  const fans = width > 0 && reveal >= STRIP_MIN;

  if (!fans) {
    return (
      <div ref={frameRef}>
        <ul className="mt-md grid gap-xs [grid-template-columns:repeat(auto-fill,minmax(11rem,1fr))]">
          {toolkit.map((tool) => (
            <li key={tool.name}>
              <Card tool={tool} lifted={false} showUse />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div ref={frameRef}>
      <ul
        className="relative mt-lg h-[clamp(10.5rem,15vw,14rem)]"
        onMouseLeave={() => setActive(null)}
      >
        {toolkit.map((tool, i) => {
          const lifted = active === i;
          const push = active !== null && i > active ? SPREAD : 0;
          return (
            <li
              key={tool.name}
              className="absolute inset-y-0 left-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
              style={{
                width: card,
                transform: `translate3d(${i * reveal + push}px, ${lifted ? -14 : 0}px, 0)`,
                zIndex: lifted ? toolkit.length : i,
              }}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <Card tool={tool} lifted={lifted} showUse={lifted} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Card({
  tool,
  lifted,
  showUse,
}: {
  tool: (typeof toolkit)[number];
  lifted: boolean;
  showUse: boolean;
}) {
  return (
    <div
      tabIndex={0}
      className={`flex h-full min-h-[10.5rem] flex-col rounded-lg border p-sm outline-none transition-colors duration-500 ${
        lifted ? 'border-accent/70 bg-bg-elev' : 'border-white/10 bg-bg-elev'
      }`}
    >
      {/* Logo, kind, name — all inside the strip the next card leaves showing, so
          the deck reads at rest. The mark keeps its own width at a shared height:
          the wordmarks (HighLevel, Systeme) would be unrecognisable squared off. */}
      <img
        src={tool.logo}
        alt=""
        className={`h-[clamp(1.25rem,1.8vw,1.75rem)] w-auto max-w-[5rem] object-contain object-left transition-opacity duration-500 ${
          lifted ? 'opacity-100' : 'opacity-80'
        }`}
      />
      <p
        className={`mt-xs font-mono text-label uppercase tracking-[0.22em] transition-colors duration-500 ${
          lifted ? 'text-accent' : 'text-muted'
        }`}
      >
        {tool.kind}
      </p>
      {/* Sized to fit the exposed strip: a name that spills under the next card
          is a name nobody reads. */}
      <h3 className="mt-2xs whitespace-nowrap font-display text-micro leading-tight text-text">
        {tool.name}
      </h3>

      {/* The reason it's in the deck. Hidden while the card is stacked: the next
          card cuts the sentence in half, and half-sentences down the row are what
          made the deck read as clutter. */}
      <p
        className={`mt-auto font-sans text-micro leading-relaxed text-muted transition-opacity duration-300 ${
          showUse ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {tool.use}
      </p>
    </div>
  );
}
