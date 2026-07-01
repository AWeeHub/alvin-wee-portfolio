import { useState } from 'react';
import type { CaseStudy } from '../../data/caseStudies';

export function MatisseFlow({ study }: { study: CaseStudy }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const steps = study.flow ?? [];
  const activeStep = steps[activeIndex];

  return (
    <div className="rounded-2xl border border-white/10 bg-bg p-6">
      <div>
        <h3 className="font-sans text-xl text-text">{study.title}</h3>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-accent">
          {study.category}
        </p>
        <p className="mt-4 max-w-2xl font-sans text-sm text-muted">{study.solution}</p>
      </div>

      <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <button
            key={step.label}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`flex-shrink-0 rounded-full border px-4 py-2 font-mono text-xs whitespace-nowrap transition ${
              i === activeIndex
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-white/10 text-muted hover:border-white/30'
            }`}
          >
            {i + 1}. {step.label}
          </button>
        ))}
      </div>

      {activeStep && (
        <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
          <img
            src={activeStep.image}
            alt={activeStep.label}
            loading="lazy"
            className="w-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
