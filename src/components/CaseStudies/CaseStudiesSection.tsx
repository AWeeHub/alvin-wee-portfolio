import { caseStudies } from '../../data/caseStudies';
import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';
import { MatisseFlow } from './MatisseFlow';
import { PipelineCaseStudies } from './PipelineCaseStudies';
import { Marquee } from '../Marquee';

export function CaseStudiesSection() {
  const [matisse, ...webBuilds] = caseStudies;

  return (
    // Band opens the section, like About — see ProblemSection.
    <section id="case-studies" className="bg-bg-elev px-gutter pb-2xl">
      <Marquee text="Featured work" className="-mx-gutter mb-xl" />
      <Reveal className="mx-auto max-w-shell">
        <SectionHeading
          title={
            <>
              <span className="font-black text-accent">Proof</span>, not promises.
            </>
          }
        />

        <div className="mt-lg">
          <MatisseFlow study={matisse} />
        </div>

        <div className="mt-xl">
          <PipelineCaseStudies studies={webBuilds} />
        </div>
      </Reveal>
    </section>
  );
}
