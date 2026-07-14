import { useEffect, useRef, useState } from 'react';
import type { CaseStudy } from '../../data/caseStudies';

/**
 * The GHL build, told as the workflow it is: the story and the twelve stages on
 * the left, the stage you picked on a screen to the right.
 *
 * The chip strip this replaced put all twelve stages in one horizontally
 * scrolling row — which meant a native scrollbar across the card, eight labels
 * cut off at the right edge, and, on a wide monitor, a column of copy with an
 * empty half-card beside it. A numbered rail is what the thing actually is.
 */
export function MatisseFlow({ study }: { study: CaseStudy }) {
  const steps = study.flow ?? [];
  const [index, setIndex] = useState(0);
  const active = steps[index];

  const storyRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLOListElement>(null);
  const screenRef = useRef<HTMLElement>(null);

  /**
   * The screenshots are portrait and tall, so the screen column ran taller than
   * the story column — and a grid row stretches the shorter one to match, which
   * left up to 360px of dead card under the last stage. Capping the screen at
   * the story's own height closes it: the image scales down to fit, and the two
   * columns end on the same line.
   *
   * The cap has to be measured. The story column's *rendered* height is the
   * stretched one (that's the circularity), so what's measured is where its
   * content actually ends — the bottom of the rail.
   */
  useEffect(() => {
    const story = storyRef.current;
    const rail = railRef.current;
    const screen = screenRef.current;
    if (!story || !rail || !screen) return;

    const apply = () => {
      // Below lg the two stack, and each is as tall as it needs to be.
      if (!window.matchMedia('(min-width: 1024px)').matches) {
        screen.style.maxHeight = '';
        return;
      }
      const padBottom = parseFloat(getComputedStyle(story).paddingBottom) || 0;
      const contentEnd =
        rail.getBoundingClientRect().bottom - story.getBoundingClientRect().top + padBottom;
      screen.style.maxHeight = `${Math.round(contentEnd)}px`;
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(story);
    ro.observe(rail);
    window.addEventListener('resize', apply);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', apply);
    };
  }, []);

  const wrap = (v: number) => ((v % steps.length) + steps.length) % steps.length;
  // Functional update: two clicks inside one React batch must advance two
  // stages, not read the same stale index twice.
  const step = (delta: number) => setIndex((current) => wrap(current + delta));

  // The neighbours are one keypress away, so they are fetched before they are
  // asked for — the screen swaps without a blank frame.
  useEffect(() => {
    if (!steps.length) return;
    for (const offset of [1, -1]) {
      const next = steps[wrap(index + offset)];
      if (next) new Image().src = next.image;
    }
  }, [index, steps]);

  if (!active) return null;

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-bg">
      {/* grid-cols-1, explicitly: without it the implicit column is auto-sized,
          which on a phone means max-content — and max-content here is the
          screenshot's natural 798px, so the card silently overflowed its own
          (clipped) box. */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        {/* The story, and the stages as a rail under it. */}
        <div ref={storyRef} className="flex flex-col border-white/10 p-md lg:border-r">
          <p className="font-mono text-label uppercase tracking-widest text-accent">
            {study.category}
          </p>
          <h3 className="mt-2xs font-logo text-card text-text">{study.title}</h3>
          <p className="mt-sm font-sans text-body text-muted">{study.solution}</p>

          {study.results && (
            <p className="mt-sm border-l-2 border-accent pl-xs font-sans text-micro text-text">
              {study.results}
            </p>
          )}

          <ul className="mt-sm flex flex-wrap gap-2xs">
            {study.techStack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-white/10 px-xs py-[0.35em] font-mono text-label uppercase tracking-[0.14em] text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>

          {/* Desktop: a numbered rail, every stage legible at once. Below lg
              there is no room for twelve rows, so it becomes a snap strip — with
              its scrollbar hidden, which is what made the old one look unfinished. */}
          <ol ref={railRef} className="no-scrollbar mt-md flex snap-x snap-mandatory gap-2xs overflow-x-auto lg:mt-lg lg:block lg:snap-none lg:overflow-visible">
            {steps.map((flowStep, i) => {
              const on = i === index;
              return (
                <li key={flowStep.label} className="shrink-0 snap-start lg:shrink lg:relative">
                  {/* The rail: a line down the numbers, lit as far as you've got. */}
                  <span
                    aria-hidden
                    className={`absolute left-[0.42rem] top-0 hidden h-full w-px lg:block ${
                      i <= index ? 'bg-accent/50' : 'bg-white/10'
                    } ${i === steps.length - 1 ? 'h-1/2' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-current={on}
                    // The floor is a thumb, not the type — the label alone left a
                    // 26px target. It is released at lg, where the rail becomes a
                    // pointer list, and taken back on any device without hover:
                    // an iPad in landscape is 1024px wide and still a thumb.
                    className={`group relative flex min-h-[2.75rem] w-full items-center gap-xs rounded-full border px-xs py-[0.4em] text-left font-mono text-label uppercase tracking-[0.12em] transition-colors duration-300 lg:min-h-0 lg:rounded-none lg:border-0 lg:bg-transparent lg:py-[0.45em] lg:pl-md [@media(hover:none)]:min-h-[2.75rem] ${
                      on
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-white/10 text-muted hover:border-white/30 hover:text-text lg:hover:text-text'
                    }`}
                  >
                    {/* The node on the rail. */}
                    <span
                      aria-hidden
                      className={`absolute left-0 hidden h-[0.85rem] w-[0.85rem] shrink-0 rounded-full border transition-colors duration-300 lg:block ${
                        on
                          ? 'border-accent bg-accent'
                          : i < index
                            ? 'border-accent/50 bg-bg'
                            : 'border-white/20 bg-bg'
                      }`}
                    />
                    <span className="tabular-nums opacity-60">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="whitespace-nowrap lg:whitespace-normal">{flowStep.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* The screen. A window frame, not a bare image floating on black. */}
        <figure
          ref={screenRef}
          className="flex min-w-0 flex-col bg-bg-elev"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') step(-1);
            if (e.key === 'ArrowRight') step(1);
          }}
          tabIndex={0}
        >
          <figcaption className="flex items-center gap-xs border-b border-white/10 px-sm py-xs">
            <span aria-hidden className="flex gap-[0.3rem]">
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-accent/60" />
            </span>
            <span className="truncate font-mono text-label uppercase tracking-[0.18em] text-muted">
              {active.label}
            </span>
            <span className="ml-auto shrink-0 font-mono text-label tabular-nums text-muted">
              {String(index + 1).padStart(2, '0')}
              <span className="opacity-40"> / {String(steps.length).padStart(2, '0')}</span>
            </span>
          </figcaption>

          {/* Ten of the twelve stages are portrait screenshots of the workflow
              builder (0.54–0.74), so a landscape frame left two thirds of itself
              empty and the screen read as lost in the card. The stage instead
              takes the height the story column sets and the image fills it — the
              height is fixed by the row, so swapping stages never reflows the
              page under the cursor. The key re-mounts the image, which is what
              plays the fade. */}
          <div className="relative flex min-h-[16rem] flex-1 items-center justify-center overflow-hidden p-sm lg:min-h-[clamp(20rem,40vw,36rem)]">
            {/* On lg the image takes the height the story column set. On a phone
                there is no column beside it, so width is what constrains it —
                h-full there would letterbox a portrait shot inside a stage twice
                its painted height. */}
            <img
              key={active.image}
              src={active.image}
              alt={active.label}
              loading={index === 0 ? 'eager' : 'lazy'}
              className="max-h-full w-auto max-w-full animate-fade-up rounded-md object-contain ring-1 ring-white/10 lg:h-full"
            />
          </div>

          <div className="flex items-center justify-between gap-xs border-t border-white/10 px-sm py-xs">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous stage"
              className="flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded-full border border-white/10 font-mono text-muted transition-colors duration-300 hover:border-accent/40 hover:text-accent"
            >
              ←
            </button>
            {/* Progress, transform-only: a scaled rule, not an animated width. */}
            <span aria-hidden className="relative h-px flex-1 overflow-hidden bg-white/10">
              <span
                className="absolute inset-0 origin-left bg-accent transition-transform duration-500 ease-out"
                style={{ transform: `scaleX(${(index + 1) / steps.length})` }}
              />
            </span>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next stage"
              className="flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded-full border border-white/10 font-mono text-muted transition-colors duration-300 hover:border-accent/40 hover:text-accent"
            >
              →
            </button>
          </div>
        </figure>
      </div>
    </article>
  );
}
