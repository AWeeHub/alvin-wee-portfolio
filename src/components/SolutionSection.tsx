import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

const PIPELINE = ['Lead in', 'Funnel', 'CRM', 'Automation', 'Booked call'];

function PipeChip({ label, final }: { label: string; final: boolean }) {
  return (
    <span
      className={`rounded-full border px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] ${
        final
          ? 'border-accent bg-accent/10 text-accent'
          : 'border-white/15 text-text'
      }`}
    >
      {label}
    </span>
  );
}

function PipeConnector() {
  return <span aria-hidden className="h-6 w-px bg-accent/40 sm:h-px sm:w-10" />;
}

export function SolutionSection() {
  return (
    <section id="solution" className="bg-bg-elev px-6 py-32">
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <SectionHeading
          align="center"
          index="02"
          node="Action"
          title={
            <>
              I don't sell websites. I build complete{' '}
              <span className="italic text-accent">customer-acquisition systems</span>.
            </>
          }
        />
        <p className="mt-8 max-w-2xl font-sans text-lg text-muted">
          Funnels, CRM, automation, and design working as one system — so you
          get more leads, more booked calls, and less manual work, instead of
          another disconnected tool.
        </p>
      </Reveal>

      <Reveal
        className="mx-auto mt-16 flex max-w-5xl flex-col items-center justify-center gap-3 sm:flex-row"
        stagger={0.12}
      >
        {PIPELINE.flatMap((label, i) => {
          const chip = (
            <PipeChip key={label} label={label} final={i === PIPELINE.length - 1} />
          );
          return i < PIPELINE.length - 1
            ? [chip, <PipeConnector key={`${label}-connector`} />]
            : [chip];
        })}
      </Reveal>
    </section>
  );
}
