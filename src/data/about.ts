export interface Company {
  name: string;
  /** Path under /public. When absent the name renders as a wordmark instead. */
  logo?: string;
}

/**
 * Drop a file at the matching path and it replaces the wordmark automatically —
 * no code change. SVG preferred; transparent PNG is fine. They render white and
 * dim, so a light or single-colour mark reads best on the dark ground.
 */
export const companies: Company[] = [
  { name: 'Matisse Academy' },
  { name: 'Fanvue' },
  { name: 'Katalyst CRM' },
  { name: 'The Methodical Group' },
  { name: 'Oracle' },
  { name: 'Trax Technologies Asia' },
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
