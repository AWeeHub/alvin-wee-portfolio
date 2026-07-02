import { describe, it, expect } from 'vitest';
import { services } from './services';

describe('services', () => {
  it('has 4 unique, non-empty labels', () => {
    expect(services.length).toBe(4);
    const labels = services.map((s) => s.label);
    expect(new Set(labels).size).toBe(4);
    for (const label of labels) {
      expect(label.trim().length).toBeGreaterThan(0);
    }
  });
});
