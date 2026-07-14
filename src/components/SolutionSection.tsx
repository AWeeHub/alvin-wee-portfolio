import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { Marquee } from './Marquee';

export function SolutionSection() {
  return (
    <section id="solution" className="bg-bg-elev px-6 py-32">
      <Marquee text="The system" className="-mx-6 mb-20" />
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <SectionHeading
          align="center"
          index="02"
          node="Action"
          title={
            <>
              I don't sell websites. I build complete{' '}
              <span className="font-black text-accent">customer-acquisition systems</span>.
            </>
          }
        />
        <p className="mt-8 max-w-2xl font-sans text-lg text-muted">
          A website alone doesn't follow up at 2am. The system underneath it
          does — the pages, the pipeline and the automations, built as one
          piece.
        </p>
      </Reveal>
    </section>
  );
}
