import { caseStudies } from '../../data/caseStudies';
import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';
import { Tilt } from '../Tilt';
import { CaseStudyCard } from './CaseStudyCard';
import { MatisseFlow } from './MatisseFlow';

export function CaseStudiesSection() {
  const [matisse, ...webBuilds] = caseStudies;

  return (
    <section id="case-studies" className="bg-bg-elev px-6 py-32">
      <Reveal className="mx-auto max-w-6xl">
        <SectionHeading
          index="04"
          node="Proof"
          title={
            <>
              <span className="italic text-accent">Proof</span>, not promises.
            </>
          }
        />

        <div className="mt-16">
          <MatisseFlow study={matisse} />
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {webBuilds.map((study) => (
            <Tilt key={study.id}>
              <CaseStudyCard study={study} />
            </Tilt>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
