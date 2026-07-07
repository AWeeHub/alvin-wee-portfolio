import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type CanvasNode = {
  id: string;
  label: string;
  desc: string;
  /** Desktop grid placement (6 cols x 3 rows, 1-indexed). */
  col: number;
  row: number;
  badge?: string;
  final?: boolean;
};

const NODES: CanvasNode[] = [
  {
    id: 'lead',
    label: 'Lead in',
    desc: 'Traffic from ads, socials, or referrals lands on a page built to capture — not just to look good.',
    col: 1,
    row: 2,
  },
  {
    id: 'funnel',
    label: 'Funnel',
    desc: 'Landing pages and forms that qualify the lead before a human ever spends a minute on them.',
    col: 2,
    row: 2,
  },
  {
    id: 'crm',
    label: 'CRM',
    desc: 'Every lead tracked in GoHighLevel — stage, source, and next action always visible. Nothing lives in someone’s head.',
    col: 3,
    row: 2,
  },
  {
    id: 'automation',
    label: 'Automation',
    desc: 'Workflows fire follow-ups, reminders, and tags on their own. This is the part that never sleeps.',
    col: 4,
    row: 2,
    badge: 'RUNNING',
  },
  {
    id: 'sms',
    label: 'SMS follow-up',
    desc: 'Replies in minutes, not days. Speed-to-lead is the highest-leverage fix in most funnels.',
    col: 5,
    row: 3,
  },
  {
    id: 'email',
    label: 'Email nurture',
    desc: 'Sequenced emails keep not-ready-yet leads warm until they are — automatically.',
    col: 5,
    row: 1,
  },
  {
    id: 'booked',
    label: 'Booked call',
    desc: 'Qualified, reminded, and confirmed — the lead shows up on your calendar, not in your backlog.',
    col: 6,
    row: 2,
    final: true,
  },
];

// [from, to] — desktop diamond topology.
const DESKTOP_EDGES: [string, string][] = [
  ['lead', 'funnel'],
  ['funnel', 'crm'],
  ['crm', 'automation'],
  ['automation', 'email'],
  ['automation', 'sms'],
  ['email', 'booked'],
  ['sms', 'booked'],
];

// Mobile: simple vertical chain in narrative order.
const MOBILE_ORDER = ['lead', 'funnel', 'crm', 'automation', 'sms', 'email', 'booked'];
const MOBILE_EDGES: [string, string][] = MOBILE_ORDER.slice(0, -1).map((id, i) => [
  id,
  MOBILE_ORDER[i + 1],
]);

export function WorkflowCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const packetRefs = useRef<(SVGCircleElement | null)[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [active, setActive] = useState('automation');

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const crect = container.getBoundingClientRect();
      if (crect.width === 0) return;
      const mobile = crect.width < 640;
      const edges = mobile ? MOBILE_EDGES : DESKTOP_EDGES;

      const center = (id: string) => {
        const el = nodeRefs.current[id];
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: r.left - crect.left + r.width / 2,
          y: r.top - crect.top + r.height / 2,
          w: r.width,
          h: r.height,
        };
      };

      const next: string[] = [];
      for (const [from, to] of edges) {
        const a = center(from);
        const b = center(to);
        if (!a || !b) continue;
        const horizontal = Math.abs(b.x - a.x) > Math.abs(b.y - a.y);
        if (horizontal) {
          const x1 = a.x + a.w / 2 + 4;
          const x2 = b.x - b.w / 2 - 4;
          const mx = (x1 + x2) / 2;
          next.push(`M ${x1} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${x2} ${b.y}`);
        } else {
          const y1 = a.y + a.h / 2 + 4;
          const y2 = b.y - b.h / 2 - 4;
          const my = (y1 + y2) / 2;
          next.push(`M ${a.x} ${y1} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${y2}`);
        }
      }
      setPaths(next);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || paths.length === 0) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let raf = 0;
    let inView = true;
    const lengths = pathRefs.current.map((p) => (p ? p.getTotalLength() : 0));
    const start = performance.now();

    const frame = (now: number) => {
      raf = 0;
      if (!inView) return;
      const t = (now - start) / 1000;
      pathRefs.current.forEach((path, i) => {
        const packet = packetRefs.current[i];
        if (!path || !packet || !lengths[i]) return;
        const progress = (t * 0.22 + i * 0.31) % 1;
        const point = path.getPointAtLength(progress * lengths[i]);
        packet.setAttribute('cx', String(point.x));
        packet.setAttribute('cy', String(point.y));
        packet.setAttribute('opacity', String(Math.sin(progress * Math.PI)));
      });
      raf = requestAnimationFrame(frame);
    };
    const play = () => {
      if (!raf && inView) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) play();
    });
    io.observe(container);
    play();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [paths]);

  const activeNode = NODES.find((n) => n.id === active) ?? NODES[3];

  return (
    <div>
      <div
        ref={containerRef}
        className="relative flex flex-col items-center gap-8 sm:grid sm:grid-cols-6 sm:grid-rows-3 sm:items-center sm:justify-items-center sm:gap-x-4 sm:gap-y-12"
      >
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          {paths.map((d, i) => (
            <g key={i}>
              <path
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
                d={d}
                fill="none"
                stroke="rgba(57,255,138,0.25)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <circle
                ref={(el) => {
                  packetRefs.current[i] = el;
                }}
                r="2.5"
                fill="#39FF8A"
                opacity="0"
              />
            </g>
          ))}
        </svg>

        {NODES.map((node) => (
          <button
            key={node.id}
            ref={(el) => {
              nodeRefs.current[node.id] = el;
            }}
            type="button"
            onClick={() => setActive(node.id)}
            onPointerEnter={() => setActive(node.id)}
            onFocus={() => setActive(node.id)}
            aria-pressed={active === node.id}
            style={{ gridColumn: node.col, gridRow: node.row }}
            className={`relative z-10 rounded-full border px-5 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
              node.final
                ? 'border-accent bg-accent/10 text-accent'
                : active === node.id
                  ? 'border-accent/70 bg-bg text-accent'
                  : 'border-white/15 bg-bg text-text hover:border-accent/40'
            }`}
          >
            {node.label}
            {node.badge && (
              <span className="absolute -top-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-bg px-2 font-mono text-[8px] tracking-[0.2em] text-accent">
                <span className="h-1 w-1 rounded-full bg-accent motion-safe:animate-pulse" />
                {node.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-xl border-t border-white/10 pt-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
          {activeNode.label}
        </p>
        <p className="mt-2 font-sans text-sm leading-relaxed text-muted sm:text-base">
          {activeNode.desc}
        </p>
      </div>
    </div>
  );
}
