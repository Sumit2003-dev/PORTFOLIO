import { useRef, useState, lazy, Suspense } from "react";
import { useLenis } from "@/hooks/use-lenis";
import ParticleField, { FogField, CursorGlow } from "@/components/Atmosphere";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// Lazy-loaded components for optimal initial paint & bundle splitting
const GithubStats = lazy(() => import("@/components/GithubStats"));
const Education = lazy(() => import("@/components/Education"));
const GoogleDeveloperJourney = lazy(() => import("@/components/GoogleDeveloperJourney"));
const Certificates = lazy(() => import("@/components/Certificates"));
const Achievements = lazy(() => import("@/components/Achievements"));
const AskSumitAI = lazy(() => import("@/components/AskSumitAI"));
const ResumeModal = lazy(() => import("@/components/ResumeModal"));

const Index = () => {
  useLenis();
  const mainRef = useRef<HTMLDivElement>(null);
  const [resumeOpen, setResumeOpen] = useState(false);

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
        <About />
        <Suspense fallback={<div className="min-h-[200px]" />}>
          <Education />
        </Suspense>
        <Skills />
        <Projects />
        <Suspense fallback={<div className="min-h-[200px]" />}>
          <GoogleDeveloperJourney />
        </Suspense>
        <Suspense fallback={<div className="min-h-[200px]" />}>
          <GithubStats />
        </Suspense>
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <Certificates />
        </Suspense>
        <Suspense fallback={<div className="min-h-[200px]" />}>
          <Achievements />
        </Suspense>
        <Contact />
      </main>

      <Footer />

      {/* Floating Interactive RAG AI Assistant */}
      <Suspense fallback={null}>
        <AskSumitAI onOpenResume={() => setResumeOpen(true)} />
      </Suspense>

      {/* In-Browser PDF Resume Modal */}
      <Suspense fallback={null}>
        <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
      </Suspense>
    </div>
  );
};

export default Index;