import { useRef, useState } from "react";
import { useLenis } from "@/hooks/use-lenis";
import ParticleField, { FogField, CursorGlow } from "@/components/Atmosphere";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import GithubStats from "@/components/GithubStats";
import Education from "@/components/Education";
import Certificates from "@/components/Certificates";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AskSumitAI from "@/components/AskSumitAI";
import ResumeModal from "@/components/ResumeModal";

const Index = () => {
  useLenis();
  const mainRef = useRef<HTMLDivElement>(null);
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <div ref={mainRef} className="ambient relative min-h-screen w-full overflow-x-hidden text-white grain">
      {/* Global cinematic atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden>
        <FogField />
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-ember-500/40 to-transparent" />
      </div>
      <ParticleField />
      <CursorGlow />

      <Navigation onOpenResume={() => setResumeOpen(true)} />

      <main className="relative z-[2]">
        <Hero onOpenResume={() => setResumeOpen(true)} />
        <About />
        <Skills />
        <Projects />
        <GithubStats />
        <Education />
        <Certificates />
        <Achievements />
        <Contact />
      </main>

      <Footer />

      {/* Floating Interactive RAG AI Assistant */}
      <AskSumitAI />

      {/* In-Browser PDF Resume Modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
};

export default Index;