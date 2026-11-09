import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { useLenis } from "@/hooks/use-lenis";
import ParticleField, { FogField, CursorGlow } from "@/components/Atmosphere";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import LazySection from "@/components/LazySection";

// Lazy-loaded below-the-fold components for ultra-fast initial paint & stream hydration
const About = lazy(() => import("@/components/About"));
const Skills = lazy(() => import("@/components/Skills"));
const Projects = lazy(() => import("@/components/Projects"));
const Education = lazy(() => import("@/components/Education"));
const GoogleDeveloperJourney = lazy(() => import("@/components/GoogleDeveloperJourney"));
const GithubStats = lazy(() => import("@/components/GithubStats"));
const Certificates = lazy(() => import("@/components/Certificates"));
const Achievements = lazy(() => import("@/components/Achievements"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));
const AskSumitAI = lazy(() => import("@/components/AskSumitAI"));
const ResumeModal = lazy(() => import("@/components/ResumeModal"));

const Index = () => {
  useLenis();
  const mainRef = useRef<HTMLDivElement>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [loadChat, setLoadChat] = useState(false);

  useEffect(() => {
    // Mount conversational AI assistant on user interaction or after initial audit window
    const onInteract = () => setLoadChat(true);
    window.addEventListener("scroll", onInteract, { once: true, passive: true });
    window.addEventListener("pointerdown", onInteract, { once: true, passive: true });
    const timer = setTimeout(onInteract, 6000);
    return () => {
      window.removeEventListener("scroll", onInteract);
      window.removeEventListener("pointerdown", onInteract);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={mainRef} className="ambient relative min-h-screen w-full overflow-x-hidden text-white grain">
      {/* Accessible skip link for keyboard & screen reader navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:rounded-lg focus:bg-ember-500 focus:px-4 focus:py-2 focus:text-black focus:font-semibold focus:shadow-glow"
      >
        Skip to main content
      </a>

      {/* Global cinematic atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden>
        <FogField />
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-ember-500/40 to-transparent" />
      </div>
      <ParticleField />
      <CursorGlow />

      <Navigation onOpenResume={() => setResumeOpen(true)} />

      <main id="main-content" className="relative z-[2]">
        <Hero onOpenResume={() => setResumeOpen(true)} />

        <LazySection id="about" minHeight="600px">
          <Suspense fallback={<div className="min-h-[600px]" />}>
            <About />
          </Suspense>
        </LazySection>

        <LazySection id="education" minHeight="500px">
          <Suspense fallback={<div className="min-h-[500px]" />}>
            <Education />
          </Suspense>
        </LazySection>

        <LazySection id="skills" minHeight="600px">
          <Suspense fallback={<div className="min-h-[600px]" />}>
            <Skills />
          </Suspense>
        </LazySection>

        <LazySection id="projects" minHeight="600px">
          <Suspense fallback={<div className="min-h-[600px]" />}>
            <Projects />
          </Suspense>
        </LazySection>

        <LazySection id="google-journey" minHeight="500px">
          <Suspense fallback={<div className="min-h-[500px]" />}>
            <GoogleDeveloperJourney />
          </Suspense>
        </LazySection>

        <LazySection id="github" minHeight="400px">
          <Suspense fallback={<div className="min-h-[400px]" />}>
            <GithubStats />
          </Suspense>
        </LazySection>

        <LazySection id="certificates" minHeight="700px">
          <Suspense fallback={<div className="min-h-[700px]" />}>
            <Certificates />
          </Suspense>
        </LazySection>

        <LazySection id="achievements" minHeight="400px">
          <Suspense fallback={<div className="min-h-[400px]" />}>
            <Achievements />
          </Suspense>
        </LazySection>

        <LazySection id="contact" minHeight="500px">
          <Suspense fallback={<div className="min-h-[500px]" />}>
            <Contact />
          </Suspense>
        </LazySection>
      </main>

      <LazySection minHeight="200px">
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </LazySection>

      {/* Floating Interactive RAG AI Assistant */}
      {loadChat && (
        <Suspense fallback={null}>
          <AskSumitAI onOpenResume={() => setResumeOpen(true)} />
        </Suspense>
      )}

      {/* In-Browser PDF Resume Modal */}
      {resumeOpen && (
        <Suspense fallback={null}>
          <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
        </Suspense>
      )}
    </div>
  );
};

export default Index;
