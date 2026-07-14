import type { ReactNode } from 'react';
import { MaskedText } from './MaskedText';

type SectionHeadingProps = {
  title: ReactNode;
  align?: 'left' | 'center';
};

export function SectionHeading({ title, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'flex flex-col items-center text-center' : ''}>
      {/* Brand face. It works here where Michroma could not: Saira is variable,
          so the accent word can still jump to 900 against the surrounding text —
          that contrast is what the headings are built on. */}
      <h2 className="max-w-[22ch] font-logo text-section font-medium tracking-tight text-text">
        <MaskedText>{title}</MaskedText>
      </h2>
    </div>
  );
}
