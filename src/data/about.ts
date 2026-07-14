export interface Company {
  name: string;
  /** Path under /public. */
  logo: string;
}

/**
 * The band is black, so each mark here is its reverse (on-dark) treatment:
 * brand colour wherever the mark carries colour, white wherever the brand only
 * publishes dark ink. All transparent-backed.
 *
 * They all render at one height (see LOGO_HEIGHT in CompanyMarquee) — by
 * request, over the earlier optically-balanced per-logo heights.
 */
export const companies: Company[] = [
  // Matisse's lockup only exists as a JPEG on a white plate: the plate is keyed
  // out by ink coverage, the brand orange kept, and the dark plum flipped to
  // warm white so it reads on black.
  { name: 'Matisse Academy', logo: '/logos/matisse-lockup.webp' },
  // Icon plus wordmark, composed here — Fanvue publishes the two separately.
  { name: 'Fanvue', logo: '/logos/fanvue-lockup.webp' },
  { name: 'Katalyst CRM', logo: '/logos/katalyst-white.webp' },
  // Their published logo, untouched. It is the one mark here whose navy sits
  // dark against the band, but recolouring it is not on the table — this is the
  // logo, and it is theirs.
  { name: 'The Methodical Group', logo: '/logos/methodical.webp' },
  { name: 'Oracle', logo: '/logos/oracle.svg' },
  { name: 'Trax Technologies Asia', logo: '/logos/trax-white.svg' },
];

export interface Tool {
  name: string;
  /** What he actually does with it — a bare logo wall says nothing. */
  use: string;
  kind: 'Build' | 'Systems' | 'AI' | 'Design';
  /**
   * Each vendor's own mark, under /public. Some are glyphs and some are
   * wordmarks — they are given a shared height and left at their own width,
   * because a wordmark squeezed into a square is not the logo any more.
   */
  logo: string;
}

/** The tools he named, in the order he named them. */
export const toolkit: Tool[] = [
  {
    name: 'WordPress',
    use: 'Sites clients can run themselves',
    kind: 'Build',
    logo: '/logos/tools/wordpress.svg',
  },
  {
    name: 'GoHighLevel',
    use: 'CRM, pipelines, and the automations behind them',
    kind: 'Systems',
    logo: '/logos/tools/gohighlevel.webp',
  },
  {
    name: 'Systeme.io',
    use: 'Funnels and email sequences end to end',
    kind: 'Systems',
    logo: '/logos/tools/systeme.svg',
  },
  {
    name: 'Claude',
    use: 'Building and shipping the work itself',
    kind: 'AI',
    logo: '/logos/tools/claude.svg',
  },
  {
    name: 'ChatGPT',
    use: 'Copy drafts and quick research',
    kind: 'AI',
    logo: '/logos/tools/chatgpt.svg',
  },
  {
    name: 'Lovable',
    use: 'Fast prototypes to react to',
    kind: 'Build',
    logo: '/logos/tools/lovable.svg',
  },
  {
    name: 'VS Code',
    use: 'Where the code actually gets written',
    kind: 'Build',
    logo: '/logos/tools/vscode.svg',
  },
  {
    name: 'Canva',
    use: 'Brand assets and creatives',
    kind: 'Design',
    logo: '/logos/tools/canva.png',
  },
];
