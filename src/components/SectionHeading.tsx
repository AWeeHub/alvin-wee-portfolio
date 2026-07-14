import type { ReactNode } from 'react';
import { MaskedText } from './MaskedText';

type NodeChipProps = {
  index: string;
  node: string;
  className?: string;
};

export function NodeChip({ index, node, className = '' }: NodeChipProps) {
  return (
    <p
      className={`inline-flex items-center gap-3 rounded-full border border-white/15 bg-bg/60 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:text-[11px] sm:tracking-[0.25em] ${className}`}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent motion-safe:animate-pulse"
      />
      <span className="text-accent">{index}</span>
      <span>{node}</span>
    </p>
  );
}

type SectionHeadingProps = {
  index: string;
  node: string;
  title: ReactNode;
  align?: 'left' | 'center';
};

export function SectionHeading({ index, node, title, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'flex flex-col items-center text-center' : ''}>
      <NodeChip index={index} node={node} />
      <h2 className="mt-8 max-w-4xl font-display text-4xl font-medium leading-[1.02] tracking-tight text-text sm:text-5xl md:text-6xl">
        <MaskedText>{title}</MaskedText>
      </h2>
    </div>
  );
}
