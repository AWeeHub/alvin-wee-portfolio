type AWeeLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZES = {
  sm: { mark: 24, word: '0.95rem' },
  md: { mark: 32, word: '1.15rem' },
  lg: { mark: 48, word: '1.6rem' },
} as const;

export function AWeeLogo({ size = 'md', className = '' }: AWeeLogoProps) {
  const s = SIZES[size];
  return (
    <a
      href="#hero"
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-label="AWee Digital — Home"
    >
      <svg
        width={s.mark}
        height={s.mark}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="flex-shrink-0"
      >
        <rect x="1.5" y="1.5" width="37" height="37" rx="10" stroke="#39FF8A" strokeWidth="1.5" />
        <path
          d="M12 27 L20 11 L28 27 M15.5 20.5 H24.5"
          stroke="#39FF8A"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="11" r="1.7" fill="#39FF8A" />
      </svg>
      <span className="font-display text-text whitespace-nowrap" style={{ fontSize: s.word }}>
        AWee <span className="text-accent">Digital</span>
      </span>
    </a>
  );
}
