type AWeeLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZES = {
  sm: { word: '0.95rem' },
  md: { word: '1.15rem' },
  lg: { word: '1.6rem' },
} as const;

export function AWeeLogo({ size = 'md', className = '' }: AWeeLogoProps) {
  const s = SIZES[size];
  return (
    <a
      href="#hero"
      className={`inline-flex items-center ${className}`}
      aria-label="AWee Digital — Home"
    >
      <span className="font-display text-text whitespace-nowrap" style={{ fontSize: s.word }}>
        AWee <span className="text-accent">Digital</span>
      </span>
    </a>
  );
}
