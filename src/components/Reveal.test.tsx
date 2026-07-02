import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';

const fromToMock = vi.fn();
const setMock = vi.fn();
const revertMock = vi.fn();
const contextMock = vi.fn((fn: () => void) => {
  fn();
  return { revert: revertMock };
});

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    context: contextMock,
    fromTo: fromToMock,
    set: setMock,
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

beforeAll(() => {
  mockMatchMedia(false);
});

describe('Reveal', () => {
  it('renders its children', async () => {
    const { Reveal } = await import('./Reveal');
    render(
      <Reveal>
        <p>First</p>
        <p>Second</p>
      </Reveal>
    );
    expect(screen.getByText('First')).toBeTruthy();
    expect(screen.getByText('Second')).toBeTruthy();
  });

  it('animates direct children via gsap.fromTo with a ScrollTrigger', async () => {
    fromToMock.mockClear();
    const { Reveal } = await import('./Reveal');
    render(
      <Reveal stagger={0.12}>
        <p>First</p>
        <p>Second</p>
      </Reveal>
    );

    expect(fromToMock).toHaveBeenCalledTimes(1);
    const [targets, fromVars, toVars] = fromToMock.mock.calls[0];
    expect(targets).toHaveLength(2);
    expect(fromVars).toEqual({ opacity: 0, y: 24 });
    expect(toVars).toMatchObject({
      opacity: 1,
      y: 0,
      stagger: 0.12,
      ease: 'power3.out',
    });
    expect(toVars.scrollTrigger).toMatchObject({
      start: 'top 80%',
      end: 'bottom top',
      toggleActions: 'play reverse play reverse',
    });
  });

  it('skips animation and sets resting state under prefers-reduced-motion', async () => {
    mockMatchMedia(true);
    fromToMock.mockClear();
    setMock.mockClear();
    const { Reveal } = await import('./Reveal');
    render(
      <Reveal>
        <p>First</p>
      </Reveal>
    );

    expect(fromToMock).not.toHaveBeenCalled();
    expect(setMock).toHaveBeenCalledTimes(1);
    const [targets, vars] = setMock.mock.calls[0];
    expect(targets).toHaveLength(1);
    expect(vars).toEqual({ opacity: 1, y: 0 });

    mockMatchMedia(false);
  });
});
