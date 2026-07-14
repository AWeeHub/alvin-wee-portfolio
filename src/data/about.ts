export interface Company {
  name: string;
  /** Path under /public. */
  logo: string;
  /**
   * Rendered height in px. A logo band looks wrong at one uniform height: a
   * crest lockup and a bare wordmark at the same height read as wildly
   * different sizes. These values balance them optically.
   */
  height: number;
}

/**
 * The band is black, so each mark here is its reverse (on-dark) treatment:
 * brand colour wherever the mark carries colour, white wherever the brand only
 * publishes dark ink. All transparent-backed.
 */
export const companies: Company[] = [
  // Matisse's lockup only exists as a JPEG on a white plate: the plate is keyed
  // out by ink coverage, the brand orange kept, and the dark plum flipped to
  // warm white so it reads on black.
  { name: 'Matisse Academy', logo: '/logos/matisse-lockup.webp', height: 60 },
  // Icon plus wordmark, composed here — Fanvue publishes the two separately.
  { name: 'Fanvue', logo: '/logos/fanvue-lockup.webp', height: 40 },
  { name: 'Katalyst CRM', logo: '/logos/katalyst-white.webp', height: 26 },
  // Wordmark only: their "M" is a single solid block of ink, so a one-colour
  // treatment flattens it into a featureless slab.
  { name: 'The Methodical Group', logo: '/logos/methodical-white.webp', height: 50 },
  { name: 'Oracle', logo: '/logos/oracle.svg', height: 28 },
  { name: 'Trax Technologies Asia', logo: '/logos/trax-white.svg', height: 42 },
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
