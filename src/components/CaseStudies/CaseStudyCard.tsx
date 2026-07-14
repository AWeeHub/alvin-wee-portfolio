import { useState } from 'react';
import type { CaseStudy } from '../../data/caseStudies';

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-2xl border border-white/10 bg-bg-elev p-6 transition-colors duration-300 hover:border-accent/30">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        data-cursor="view"
        className="group w-full text-left"
      >
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40">
          <div className="flex items-center gap-1.5 border-b border-white/10 bg-bg px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </div>
          <img
            src={study.images[0]}
            alt={`${study.title} preview`}
            loading="lazy"
            className="aspect-video w-full object-cover object-top transition duration-500 group-hover:scale-105"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-accent/0 transition duration-500 group-hover:bg-accent/10"
          />
        </div>
        <div className="mt-sm flex items-baseline justify-between gap-xs">
          <h3 className="font-display text-card text-text">{study.title}</h3>
          <span
            aria-hidden
            className="font-mono text-label text-muted transition-colors duration-300 group-hover:text-accent"
          >
            {expanded ? '−' : '+'}
          </span>
        </div>
        <p className="mt-2xs font-mono text-label uppercase tracking-widest text-accent">
          {study.category}
        </p>
      </button>

      {expanded && (
        <div className="mt-sm space-y-xs border-t border-white/10 pt-sm">
          <div>
            <p className="font-mono text-label uppercase tracking-widest text-muted">Problem</p>
            <p className="mt-2xs font-sans text-micro text-text">{study.problem}</p>
          </div>
          <div>
            <p className="font-mono text-label uppercase tracking-widest text-muted">Solution</p>
            <p className="mt-2xs font-sans text-micro text-text">{study.solution}</p>
          </div>
          <div>
            <p className="font-mono text-label uppercase tracking-widest text-muted">Stack</p>
            <p className="mt-2xs font-sans text-micro text-text">{study.techStack.join(' · ')}</p>
          </div>
          {study.results && (
            <div>
              <p className="font-mono text-label uppercase tracking-widest text-muted">Results</p>
              <p className="mt-2xs font-sans text-micro text-text">{study.results}</p>
            </div>
          )}
          {study.liveUrl && (
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block font-sans text-micro text-accent underline"
            >
              View live site →
            </a>
          )}
        </div>
      )}
    </article>
  );
}
