/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // One typeface across the site. The three tokens are kept so existing
      // font-sans / font-display / font-mono classes keep working, but they all
      // resolve to Archivo — identity comes from weight and scale, not from
      // mixing families.
      fontFamily: {
        // Body voice: sublines, row descriptions, the About paragraphs.
        sans: ['Poppins', 'Archivo Variable', 'system-ui', 'sans-serif'],
        // Display voice: the hero promise and the big marquee bands, where the
        // weight jump to 900 is the whole effect.
        display: ['Archivo Variable', 'Inter', 'system-ui', 'sans-serif'],
        // The brand face (Saira, standing in for Eurostile) carries the label
        // layer: nav, eyebrows, chips, captions, the status bar, and the two
        // row-list titles — the instrument chrome. Headlines stay Archivo: their
        // identity is its light-to-900 jump, and body copy stays Archivo too.
        mono: ['Saira Variable', 'Archivo Variable', 'system-ui', 'sans-serif'],
        logo: ['Saira Variable', 'Archivo Variable', 'system-ui', 'sans-serif'],
      },
      // Fluid scale, defined in index.css. These utilities replace the
      // text-xl sm:text-2xl md:text-3xl ladders: one class, continuous scaling.
      fontSize: {
        label: ['var(--step--2)', { lineHeight: '1.4' }],
        micro: ['var(--step--1)', { lineHeight: '1.5' }],
        body: ['var(--step-0)', { lineHeight: '1.65' }],
        lead: ['var(--step-1)', { lineHeight: '1.55' }],
        row: ['var(--step-2)', { lineHeight: '1.15' }],
        card: ['var(--step-3)', { lineHeight: '1.15' }],
        section: ['var(--step-4)', { lineHeight: '1.02' }],
        hero: ['var(--step-5)', { lineHeight: '1.02' }],
        pain: ['var(--step-pain)', { lineHeight: '1.15' }],
      },
      spacing: {
        gutter: 'var(--gutter)',
        '2xs': 'var(--space-2xs)',
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
      },
      maxWidth: {
        shell: 'var(--shell)',
        'shell-text': 'var(--shell-text)',
      },
      colors: {
        bg: '#05070A',
        'bg-elev': '#0B0D0E',
        text: '#F4F6F5',
        muted: '#8A9490',
        accent: '#39FF8A',
        'accent-dim': '#1FAE5B',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scrollCue: {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '45%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '55%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'scroll-cue': 'scrollCue 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
