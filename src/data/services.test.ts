import { describe, it, expect } from 'vitest';
import { services } from './services';

describe('services', () => {
  it('has unique, non-empty labels', () => {
    expect(services.length).toBeGreaterThan(0);
    const labels = services.map((s) => s.label);
    expect(new Set(labels).size).toBe(labels.length);
    for (const label of labels) {
      expect(label.trim().length).toBeGreaterThan(0);
    }
  });
});
