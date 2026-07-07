import {
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

type Counter = { i: number };

function collectWords(
  node: ReactNode,
  out: ReactNode[],
  wordClass: string,
  counter: Counter
): void {
  if (node == null || typeof node === 'boolean') return;

  if (typeof node === 'string' || typeof node === 'number') {
    for (const part of String(node).split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        out.push(' ');
        continue;
      }
      const delay = { '--mask-delay': `${counter.i * 45}ms` } as CSSProperties;
      counter.i += 1;
      out.push(
        // Outer span masks; padding keeps descenders from clipping at rest.
        <span
          key={out.length}
          className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-top"
        >
          <span
            data-masked-word
            className={`inline-block ${wordClass}`}
            style={delay}
          >
            {part}
          </span>
        </span>
      );
    }
    return;
  }

  if (Array.isArray(node)) {
    for (const child of node) collectWords(child, out, wordClass, counter);
    return;
  }

  if (isValidElement(node)) {
    const props = node.props as { className?: string; children?: ReactNode };
    const childClass = [wordClass, props.className].filter(Boolean).join(' ');
    collectWords(props.children, out, childClass, counter);
  }
}

type MaskedTextProps = {
  children: ReactNode;
  className?: string;
  /** While true, words stay hidden; flipping to false plays the reveal. */
  paused?: boolean;
  /** true (default): reveal when scrolled into view; false: reveal when unpaused. */
  scroll?: boolean;
};

export function MaskedText({
  children,
  className,
  paused = false,
  scroll = true,
}: MaskedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!scroll) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [scroll]);

  const revealed = scroll ? inView : !paused;

  const words: ReactNode[] = [];
  collectWords(children, words, '', { i: 0 });

  return (
    <span
      ref={ref}
      className={`${className ?? ''}${revealed ? ' masked-revealed' : ''}`}
    >
      {words}
    </span>
  );
}
