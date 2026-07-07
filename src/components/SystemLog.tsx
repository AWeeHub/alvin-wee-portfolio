import { useEffect, useRef, useState } from 'react';

const EVENTS = [
  'lead captured → tagged "new"',
  'welcome sms sent',
  'email #1 delivered',
  'lead replied → moved to "warm"',
  'booking link sent',
  'call booked → calendar synced',
  'reminder queued (24h before)',
  'no-show detected → rescue sms sent',
  'call rebooked',
  'invoice sent',
  'payment confirmed → tagged "client"',
  'review request scheduled',
];

type LogLine = {
  id: number;
  time: string;
  text: string;
};

function timestamp(): string {
  return new Date().toLocaleTimeString('en-GB', { hour12: false });
}

export function SystemLog() {
  const [lines, setLines] = useState<LogLine[]>(() => [
    { id: 0, time: timestamp(), text: EVENTS[0] },
  ]);
  const counter = useRef(1);

  useEffect(() => {
    let timeout: number;
    const tick = () => {
      setLines((current) => {
        const id = counter.current;
        counter.current += 1;
        const next = {
          id,
          time: timestamp(),
          text: EVENTS[id % EVENTS.length],
        };
        return [...current, next].slice(-4);
      });
      timeout = window.setTimeout(tick, 2200 + Math.random() * 1400);
    };
    timeout = window.setTimeout(tick, 1800);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-8 left-16 hidden w-80 select-none text-left lg:block"
    >
      <p className="flex items-center gap-2 border-b border-white/10 pb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
        sys.log // simulation
        <span className="ml-auto text-accent">{counter.current.toString().padStart(3, '0')}</span>
      </p>
      <ul className="mt-2 space-y-1.5">
        {lines.map((line, i) => (
          <li
            key={line.id}
            className="flex gap-3 font-mono text-[10px] leading-relaxed motion-safe:animate-fade-up"
            style={{ opacity: 0.35 + (i / (lines.length - 1 || 1)) * 0.65 }}
          >
            <span className="shrink-0 text-accent/80">{line.time}</span>
            <span className="text-muted">{line.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
