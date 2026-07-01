import { useState } from 'react';
import type { CaseStudy } from '../../data/caseStudies';

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-2xl border border-white/10 bg-bg-elev p-6">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className="w-full text-left"
      >
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
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
        </div>
        <h3 className="mt-5 font-sans text-xl text-text">{study.title}</h3>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-accent">
          {study.category}
        </p>
      </button>

      {expanded && (
        <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Problem</p>
            <p className="mt-1 font-sans text-sm text-text">{study.problem}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Solution</p>
            <p className="mt-1 font-sans text-sm text-text">{study.solution}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Stack</p>
            <p className="mt-1 font-sans text-sm text-text">{study.techStack.join(' · ')}</p>
          </div>
          {study.results && (
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">Results</p>
              <p className="mt-1 font-sans text-sm text-text">{study.results}</p>
            </div>
          )}
          {study.liveUrl && (
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block font-sans text-sm text-accent underline"
            >
              View live site →
            </a>
          )}
        </div>
      )}
    </article>
  );
}
