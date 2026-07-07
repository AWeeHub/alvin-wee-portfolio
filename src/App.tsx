import { useState } from 'react';
import { useSmoothScroll } from './lib/scroll';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { CinematicBackdrop } from './components/CinematicBackdrop';
import { SiteHeader } from './components/SiteHeader';
import { WorkflowSpine } from './components/WorkflowSpine';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { ServicesGrid } from './components/ServicesGrid';
import { CaseStudiesSection } from './components/CaseStudies/CaseStudiesSection';
import { ProcessSection } from './components/ProcessSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export default function App() {
  useSmoothScroll();
  const [ready, setReady] = useState(false);

  return (
    <main>
      <Preloader onComplete={() => setReady(true)} />
      <CustomCursor />
      <CinematicBackdrop />
      <SiteHeader />
      <WorkflowSpine />
      <Hero introReady={ready} />
      <ProblemSection />
      <SolutionSection />
      <ServicesGrid />
      <CaseStudiesSection />
      <ProcessSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
