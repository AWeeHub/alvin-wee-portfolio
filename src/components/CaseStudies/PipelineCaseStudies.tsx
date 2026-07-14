import { useEffect, useState } from 'react';
import type { CaseStudy } from '../../data/caseStudies';
import { Tilt } from '../Tilt';
import { CaseStudyCard } from './CaseStudyCard';
import { PipelineSlider } from './PipelineSlider';

/**
 * Web builds presented as a pipeline: each project is a node on the track, and
 * packets run between them the same way leads move through a GHL workflow.
 *
 * The WebGL track is presentation only. All copy, links and focus live in the
 * DOM below it, and browsers without WebGL2 (or with reduced motion on) get the
 * plain card grid instead — nothing is only reachable through the canvas.
 */
export function PipelineCaseStudies({ studies }: { studies: CaseStudy[] }) {
  const [index, setIndex] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const probe = document.createElement('canvas');
    if (probe.getContext('webgl2')) setEnabled(true);
  }, []);

  if (!enabled) {
    return (
      <div className="grid gap-md [grid-template-columns:repeat(auto-fit,minmax(min(22rem,100%),1fr))]">
        {studies.map((study) => (
          <Tilt key={study.id}>
            <CaseStudyCard study={study} />
          </Tilt>
        ))}
      </div>
    );
  }

  const active = studies[index];
  // The track loops, so the controls loop with it: past the last card is the
  // first one, not a dead end.
  const wrap = (v: number) => ((v % studies.length) + studies.length) % studies.length;
  const goTo = (next: number) => setIndex(wrap(next));
  // Functional update: two arrow clicks inside one React batch must advance
  // two cards, not read the same stale index twice.
  const step = (delta: number) => setIndex((current) => wrap(current + delta));

  return (
    <div>
      <div
        className="relative h-[54vw] max-h-[clamp(22rem,50vh,38rem)] min-h-[18rem] w-full"
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') step(-1);
          if (e.key === 'ArrowRight') step(1);
        }}
      >
        <PipelineSlider studies={studies} index={index} onIndexChange={setIndex} />
      </div>

      <div className="mt-md flex items-center justify-center gap-xs">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous project"
          className="flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded-full border border-white/10 font-mono text-muted transition-colors duration-300 hover:border-accent/40 hover:text-accent"
        >
          ←
        </button>

        <div className="flex gap-2">
          {studies.map((study, i) => (
            <button
              key={study.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={study.title}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? 'w-8 bg-accent' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next project"
          className="flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded-full border border-white/10 font-mono text-muted transition-colors duration-300 hover:border-accent/40 hover:text-accent"
        >
          →
        </button>
      </div>

      <p className="mt-xs text-center font-mono text-label uppercase tracking-[0.3em] text-muted">
        Drag the track
      </p>

      {/* The canvas is decorative; this is the real, readable case study. */}
      <div aria-live="polite" className="mx-auto mt-md max-w-[62ch] text-center">
        <p className="font-mono text-label uppercase tracking-widest text-accent">
          {active.category}
        </p>
        <h3 className="mt-2xs font-display text-card text-text">{active.title}</h3>
        <p className="mt-xs font-sans text-body text-muted">{active.solution}</p>
        <p className="mt-xs font-mono text-label text-muted">{active.techStack.join(' · ')}</p>
        {active.liveUrl && (
          <a
            href={active.liveUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor="view"
            className="mt-sm inline-block font-sans text-micro text-accent underline underline-offset-4"
          >
            View live site →
          </a>
        )}
      </div>
    </div>
  );
}
