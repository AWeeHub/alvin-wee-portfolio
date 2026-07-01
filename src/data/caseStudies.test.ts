import { describe, it, expect } from 'vitest';
import { caseStudies } from './caseStudies';

describe('caseStudies', () => {
  it('has exactly 5 entries in flagship-first order', () => {
    expect(caseStudies.map((c) => c.id)).toEqual([
      'matisse-academy',
      'ev-installer',
      'ironhaul-logistics',
      'avnm-caffe',
      'tricia-portfolio',
    ]);
  });

  it('has unique ids', () => {
    const ids = caseStudies.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('marks Matisse Academy as GHL Automation with an ordered flow and no liveUrl', () => {
    const matisse = caseStudies.find((c) => c.id === 'matisse-academy');
    expect(matisse?.category).toBe('GHL Automation');
    expect(matisse?.liveUrl).toBeUndefined();
    expect(matisse?.flow?.length).toBe(12);
    expect(matisse?.flow?.[0].label).toBe('Challenge Optin');
  });

  it('marks every other entry as Web Build with a liveUrl and no flow', () => {
    const webBuilds = caseStudies.filter((c) => c.id !== 'matisse-academy');
    for (const study of webBuilds) {
      expect(study.category).toBe('Web Build');
      expect(study.liveUrl).toMatch(/^https:\/\/.+\.vercel\.app$/);
      expect(study.flow).toBeUndefined();
    }
  });
});
