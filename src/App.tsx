import { useSmoothScroll } from './lib/scroll';
import { CinematicBackdrop } from './components/CinematicBackdrop';
import { SiteHeader } from './components/SiteHeader';
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

  return (
    <main>
      <CinematicBackdrop />
      <SiteHeader />
      <Hero />
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
