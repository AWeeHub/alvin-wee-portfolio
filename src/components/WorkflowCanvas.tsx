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

/** Stable pseudo-random in 0..1 — the scatter must not reshuffle on re-render. */
function seeded(i: number): number {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

/** Where node i sits before the machine assembles, in CSS px from its slot. */
function scatterOf(i: number) {
  const angle = seeded(i) * Math.PI * 2;
  const dist = 140 + seeded(i + 7) * 160;
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist * 0.7,
    rot: (seeded(i + 13) - 0.5) * 70,
  };
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = (v: number) => 1 - Math.pow(1 - v, 3);

const NODE_STAGGER = 0.06;
const NODE_SPAN = 1 - (NODES.length - 1) * NODE_STAGGER;

export function WorkflowCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const solidRefs = useRef<(SVGPathElement | null)[]>([]);
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

      // offset* rather than getBoundingClientRect: the assembly below puts a
      // CSS transform on every node, and rects include transforms — measuring
      // through them would wire the connectors to the scattered positions.
      const center = (id: string) => {
        const el = nodeRefs.current[id];
        if (!el) return null;
        return {
          x: el.offsetLeft + el.offsetWidth / 2,
          y: el.offsetTop + el.offsetHeight / 2,
          w: el.offsetWidth,
          h: el.offsetHeight,
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

    // Scatter before the first paint, otherwise the assembled machine flashes
    // for a frame before the rAF loop (which runs after paint) takes over.
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      NODES.forEach((node, i) => {
        const el = nodeRefs.current[node.id];
        if (!el) return;
        const s = scatterOf(i);
        el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg) scale(0.72)`;
        el.style.opacity = '0';
      });
    }

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || paths.length === 0) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      // Show the finished machine; skip the assembly entirely.
      NODES.forEach((node) => {
        const el = nodeRefs.current[node.id];
        if (el) el.style.opacity = '1';
      });
      return;
    }

    let raf = 0;
    let inView = true;
    const lengths = pathRefs.current.map((p) => (p ? p.getTotalLength() : 0));
    const start = performance.now();

    const frame = (now: number) => {
      raf = 0;
      if (!inView) return;
      const t = (now - start) / 1000;

      // Assembly progress, read live from the container's position each frame.
      // ScrollTrigger toggles go stale here the same way they did on the
      // WorkflowSpine nodes; a live rect never does.
      const rect = container.getBoundingClientRect();
      const startY = window.innerHeight * 0.92;
      const endY = window.innerHeight * 0.42;
      const p = clamp01((startY - rect.top) / (startY - endY));

      // Nodes fly in from their scattered positions, in narrative order.
      NODES.forEach((node, i) => {
        const el = nodeRefs.current[node.id];
        if (!el) return;
        const e = easeOut(clamp01((p - i * NODE_STAGGER) / NODE_SPAN));
        const s = scatterOf(i);
        const inv = 1 - e;
        // Transform-only: never touch layout, so the measured connector
        // geometry stays valid throughout.
        el.style.transform = `translate(${s.x * inv}px, ${s.y * inv}px) rotate(${
          s.rot * inv
        }deg) scale(${0.72 + 0.28 * e})`;
        el.style.opacity = String(e);
      });

      // Connectors etch themselves in once the nodes have mostly landed, then
      // cross-fade from a solid trace into the dotted circuit line.
      const settle = clamp01((p - 0.92) / 0.08);
      pathRefs.current.forEach((dotted, i) => {
        const solid = solidRefs.current[i];
        const len = lengths[i];
        if (!dotted || !solid || !len) return;
        const draw = clamp01((p - 0.5 - i * 0.04) / 0.3);
        solid.style.strokeDasharray = `${len * draw} ${len}`;
        solid.style.opacity = String(1 - settle);
        dotted.style.opacity = String(settle);
      });

      // Packets only run on a finished machine.
      const flowing = p > 0.95;
      pathRefs.current.forEach((path, i) => {
        const packet = packetRefs.current[i];
        if (!path || !packet || !lengths[i]) return;
        if (!flowing) {
          packet.setAttribute('opacity', '0');
          return;
        }
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
              {/* Etches in as the machine assembles, then hands off to the
                  dotted trace below. */}
              <path
                ref={(el) => {
                  solidRefs.current[i] = el;
                }}
                d={d}
                fill="none"
                stroke="rgba(57,255,138,0.7)"
                strokeWidth="1"
                strokeDasharray="0 9999"
              />
              <path
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
                d={d}
                fill="none"
                stroke="rgba(57,255,138,0.25)"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0"
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
