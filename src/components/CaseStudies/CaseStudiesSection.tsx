import { caseStudies } from '../../data/caseStudies';
import { Reveal } from '../Reveal';
import { CaseStudyCard } from './CaseStudyCard';
import { MatisseFlow } from './MatisseFlow';

export function CaseStudiesSection() {
  const [matisse, ...webBuilds] = caseStudies;

  return (
    <section id="case-studies" className="bg-bg-elev px-6 py-32">
      <Reveal className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl text-text sm:text-4xl">
          Proof, not promises.
        </h2>

        <div className="mt-16">
          <MatisseFlow study={matisse} />
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {webBuilds.map((study) => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
