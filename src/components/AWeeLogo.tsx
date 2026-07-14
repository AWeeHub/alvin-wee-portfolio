type AWeeLogoProps = {
  /**
   * 'wordmark' is the mark with AWEE DIGITAL set beside it — the header and
   * footer treatment. 'lockup' is the artwork on its own, wordmark baked in
   * underneath: it only reads at intro scale, so the preloader is the one place
   * it is used.
   */
  variant?: 'wordmark' | 'lockup';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

// Fluid, like everything else: the mark grows with the viewport between a floor
// and a ceiling rather than sitting at one of three fixed heights.
const MARK_HEIGHT = {
  sm: 'clamp(1.5rem, 2.1vw, 2.5rem)',
  md: 'clamp(2rem, 2.6vw, 3rem)',
  lg: 'clamp(2.5rem, 3.4vw, 4rem)',
} as const;
const LOCKUP_HEIGHT = {
  sm: 'clamp(3.5rem, 6vw, 6rem)',
  md: 'clamp(4.5rem, 8vw, 8rem)',
  lg: 'clamp(6rem, 11vw, 11rem)',
} as const;
// Set to match the type inside the artwork: light, uppercase, widely tracked.
// Smaller than a normal wordmark, because the tracking is what carries it.
const WORD_SIZE = {
  sm: 'clamp(0.625rem, 0.55rem + 0.2vw, 0.9rem)',
  md: 'clamp(0.7rem, 0.6rem + 0.25vw, 1.05rem)',
  lg: 'clamp(0.875rem, 0.7rem + 0.45vw, 1.4rem)',
} as const;

export function AWeeLogo({ variant = 'wordmark', size = 'md', className = '' }: AWeeLogoProps) {
  return (
    <a
      href="#hero"
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label="AWee Digital — Home"
    >
      <img
        src={variant === 'lockup' ? '/logo-lockup.webp' : '/logo-mark.webp'}
        alt=""
        style={{ height: variant === 'lockup' ? LOCKUP_HEIGHT[size] : MARK_HEIGHT[size] }}
        className="w-auto"
        // The intro shows this before anything else on the page.
        fetchPriority={variant === 'lockup' ? 'high' : undefined}
      />
      {variant === 'wordmark' && (
        <span
          className="whitespace-nowrap font-logo font-light uppercase tracking-[0.3em] text-text"
          style={{ fontSize: WORD_SIZE[size] }}
        >
          AWee <span className="text-accent">Digital</span>
        </span>
      )}
    </a>
  );
}
