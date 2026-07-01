// src/data/caseStudies.assets.test.ts
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { caseStudies } from './caseStudies';

function assertPublicAssetExists(publicPath: string) {
  const filePath = resolve(process.cwd(), 'public', publicPath.replace(/^\//, ''));
  expect(existsSync(filePath), `missing asset: ${publicPath}`).toBe(true);
}

describe('caseStudies image assets', () => {
  it('every top-level image path resolves to a real file', () => {
    for (const study of caseStudies) {
      for (const image of study.images) {
        assertPublicAssetExists(image);
      }
    }
  });

  it('every Matisse Academy flow step image resolves to a real file', () => {
    const matisse = caseStudies.find((c) => c.id === 'matisse-academy');
    for (const step of matisse?.flow ?? []) {
      assertPublicAssetExists(step.image);
    }
  });
});
