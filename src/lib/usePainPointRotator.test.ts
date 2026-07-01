import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePainPointRotator } from './usePainPointRotator';

describe('usePainPointRotator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts at index 0 and advances on each interval, wrapping around', () => {
    const lines = ['a', 'b', 'c'];
    const { result } = renderHook(() => usePainPointRotator(lines, 1000));

    expect(result.current).toBe(0);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(1);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current).toBe(0);
  });

  it('never advances when given a single line', () => {
    const { result } = renderHook(() => usePainPointRotator(['only'], 1000));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current).toBe(0);
  });
});
