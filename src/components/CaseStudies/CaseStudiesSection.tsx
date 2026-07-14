import { caseStudies } from '../../data/caseStudies';
import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';
import { MatisseFlow } from './MatisseFlow';
import { PipelineCaseStudies } from './PipelineCaseStudies';
import { Marquee } from '../Marquee';

export function CaseStudiesSection() {
  const [matisse, ...webBuilds] = caseStudies;

  return (
    <section id="case-studies" className="bg-bg-elev px-6 py-32">
      <Marquee text="Featured work" className="-mx-6 mb-20" />
      <Reveal className="mx-auto max-w-6xl">
        <SectionHeading
          title={
            <>
              <span className="font-black text-accent">Proof</span>, not promises.
            </>
          }
        />

        <div className="mt-16">
          <MatisseFlow study={matisse} />
        </div>

        <div className="mt-24">
          <PipelineCaseStudies studies={webBuilds} />
        </div>
      </Reveal>
    </section>
  );
}
