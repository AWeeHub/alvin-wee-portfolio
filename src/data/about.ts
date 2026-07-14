export interface Company {
  name: string;
  /** Path under /public. */
  logo: string;
  /**
   * Rendered height in px. A logo band looks wrong at one uniform height: a
   * square crest and a wide wordmark at the same height read as wildly
   * different sizes. These values balance them optically.
   */
  height: number;
  /**
   * For marks that ship white-only. The band is cream, so a white mark is
   * invisible on it; these are flat monochrome, so inverting them yields the
   * black-on-light lockup the brand actually uses. Never set this on a logo
   * that carries real colour — inverting those corrupts the brand.
   */
  invert?: boolean;
}

/** Sourced from each company's own site. Every one is transparent-backed. */
export const companies: Company[] = [
  // Matisse ships no crest+wordmark lockup: the crest is an image and the name
  // is set in Cormorant Garamond on their pages. This asset composes the two, so
  // the band shows a logo rather than a bare shield and the site pays no extra
  // font cost.
  { name: 'Matisse Academy', logo: '/logos/matisse-lockup.webp', height: 52 },
  { name: 'Fanvue', logo: '/logos/fanvue.svg', height: 30, invert: true },
  // Their only asset is a white-body wordmark with coloured accent glyphs, so
  // it ships here with the neutral body repainted to ink — inverting it would
  // have flipped the accent colours too.
  { name: 'Katalyst CRM', logo: '/logos/katalyst-color.webp', height: 26 },
  { name: 'The Methodical Group', logo: '/logos/methodical-color.webp', height: 48 },
  { name: 'Oracle', logo: '/logos/oracle.svg', height: 28 },
  { name: 'Trax Technologies Asia', logo: '/logos/trax.svg', height: 42 },
];

export interface ToolGroup {
  label: string;
  tools: string[];
}

export const toolkit: ToolGroup[] = [
  { label: 'Build', tools: ['React', 'Next.js', 'Tailwind CSS'] },
  { label: 'Motion', tools: ['GSAP', 'Three.js'] },
  { label: 'Systems', tools: ['GoHighLevel', 'Systeme.io'] },
  { label: 'AI & Design', tools: ['Claude', 'ChatGPT', 'Canva'] },
];
