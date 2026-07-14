export interface Company {
  name: string;
  /** Path under /public. When absent the name renders as a wordmark instead. */
  logo?: string;
  /**
   * Rendered height in px. Logo strips look wrong at one uniform height: a wide
   * wordmark and a square crest with the same height read as wildly different
   * sizes. These values balance them optically, so they are per-logo rather than
   * a single class on the <img>.
   */
  height?: number;
}

/**
 * Every logo is drawn white via a brightness(0) invert(1) filter, so the source
 * colour is irrelevant — but the background must be transparent, or the mark
 * lands on the page as a solid white slab.
 */
export const companies: Company[] = [
  { name: 'Matisse Academy', logo: '/logos/matisse.webp', height: 44 },
  { name: 'Fanvue', logo: '/logos/fanvue.svg', height: 26 },
  { name: 'Katalyst CRM', logo: '/logos/katalyst.webp', height: 24 },
  // Wordmark only. Their full lockup leads with a two-tone "M" that is one solid
  // block of ink, and the white filter flattens it into a featureless slab.
  { name: 'The Methodical Group', logo: '/logos/methodical.webp', height: 56 },
  { name: 'Oracle', logo: '/logos/oracle.svg', height: 24 },
  { name: 'Trax Technologies Asia', logo: '/logos/trax.svg', height: 30 },
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
