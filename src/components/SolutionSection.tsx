import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { WorkflowCanvas } from './WorkflowCanvas';

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
          A website alone doesn't follow up at 2am. The system underneath it
          does — and this is what it looks like.
        </p>
      </Reveal>

      <Reveal className="mx-auto mt-20 max-w-5xl">
        <p className="mb-10 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          Scroll to assemble the system — tap any node
        </p>
        <WorkflowCanvas />
      </Reveal>
    </section>
  );
}
