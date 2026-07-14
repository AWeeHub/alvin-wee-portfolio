import { useState } from 'react';
import { useSmoothScroll } from './lib/scroll';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { CinematicBackdrop } from './components/CinematicBackdrop';
import { SiteHeader } from './components/SiteHeader';
import { StatusBar } from './components/StatusBar';
import { WorkflowSpine } from './components/WorkflowSpine';
import { Hero } from './components/Hero';
import { CompanyMarquee } from './components/CompanyMarquee';
import { ProblemSection } from './components/ProblemSection';
import { ServicesGrid } from './components/ServicesGrid';
import { AboutSection } from './components/AboutSection';
import { CaseStudiesSection } from './components/CaseStudies/CaseStudiesSection';
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
      <StatusBar />
      <WorkflowSpine />
      <Hero introReady={ready} />
      <CompanyMarquee />
      <ProblemSection />
      <ServicesGrid />
      <AboutSection />
      <CaseStudiesSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
