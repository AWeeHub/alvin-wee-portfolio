import { useEffect, useState } from 'react';

export function usePainPointRotator(lines: string[], intervalMs = 2600): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (lines.length <= 1) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % lines.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [lines, intervalMs]);

  return index;
}
