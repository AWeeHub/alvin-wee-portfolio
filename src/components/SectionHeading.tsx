import type { ReactNode } from 'react';
import { MaskedText } from './MaskedText';

type NodeChipProps = {
  label: string;
  className?: string;
};

/** The role chip in the hero. Sections no longer carry one: the floating bar at
 *  the bottom of the viewport already names the section you're in. */
export function NodeChip({ label, className = '' }: NodeChipProps) {
  return (
    <p
      className={`inline-flex items-center gap-3 rounded-full border border-white/15 bg-bg/60 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:text-[11px] sm:tracking-[0.25em] ${className}`}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent motion-safe:animate-pulse"
      />
      <span>{label}</span>
    </p>
  );
}

type SectionHeadingProps = {
  title: ReactNode;
  align?: 'left' | 'center';
};

export function SectionHeading({ title, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'flex flex-col items-center text-center' : ''}>
      <h2 className="max-w-4xl font-display text-4xl font-medium leading-[1.02] tracking-tight text-text sm:text-5xl md:text-6xl">
        <MaskedText>{title}</MaskedText>
      </h2>
    </div>
  );
}
