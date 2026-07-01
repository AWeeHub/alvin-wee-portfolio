import { describe, it, expect } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

describe('hero avatar asset', () => {
  it('public/avatar.png exists and is non-empty', () => {
    const filePath = resolve(process.cwd(), 'public', 'avatar.png');
    expect(existsSync(filePath)).toBe(true);
    expect(statSync(filePath).size).toBeGreaterThan(0);
  });
});
