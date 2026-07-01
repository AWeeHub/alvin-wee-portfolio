import { describe, it, expect, vi, beforeAll } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('lenis', () => ({
  default: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    raf: vi.fn(),
    destroy: vi.fn(),
  })),
}));

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    ticker: {
      add: vi.fn(),
      remove: vi.fn(),
      lagSmoothing: vi.fn(),
    },
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    update: vi.fn(),
  },
}));

describe('useSmoothScroll', () => {
  beforeAll(() => {
    // Mock window.matchMedia for GSAP
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('creates a Lenis instance on mount and destroys it on unmount', async () => {
    const { useSmoothScroll } = await import('./scroll');
    const Lenis = (await import('lenis')).default as unknown as ReturnType<typeof vi.fn>;

    const { unmount } = renderHook(() => useSmoothScroll());
    expect(Lenis).toHaveBeenCalledTimes(1);

    const instance = (Lenis as any).mock.results[0].value;
    unmount();
    expect(instance.destroy).toHaveBeenCalledTimes(1);
  });
});
