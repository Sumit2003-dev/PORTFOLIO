import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Mail, Download, ArrowRight, Eye, Sparkles, Cpu, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { scrollToId } from "@/hooks/use-lenis";
import { profile } from "@/lib/data";
import { useFadeUp } from "@/hooks/use-scroll";
import { useMagnetic } from "@/hooks/use-interactions";
import AiSphere3D from "./3d/AiSphere3D";

const HOME_BG = "/uploads/homepage.png";
const ROLES = ["Data Scientist", "AI Engineer", "Machine Learning Developer"];

function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useMagnetic<HTMLSpanElement>();
  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
}

const headContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.15 } },
};
const headWord = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } },
};

type HeroProps = {
  onOpenResume?: () => void;
};

export default function Hero({ onOpenResume }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);

  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setRoleIdx((i) => (i + 1) % ROLES.length), 2600);
    return () => clearInterval(t);
  }, []);

  /* 3D tilt & stretch spring physics */
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rX = useSpring(useTransform(my, [0, 1], [12, -12]), { stiffness: 160, damping: 20 });
  const rY = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 160, damping: 20 });
  const rZ = useSpring(useTransform(mx, [0, 0.5, 1], [2, 0, -2]), { stiffness: 140, damping: 22 });
  const sX = useSpring(useTransform(mx, [0, 0.5, 1], [0.97, 1, 1.03]), { stiffness: 220, damping: 22 });
  const sY = useSpring(useTransform(my, [0, 0.5, 1], [1.03, 1, 0.97]), { stiffness: 220, damping: 22 });
  const imgScale = useSpring(useTransform(my, [0, 0.5, 1], [1.02, 1.05, 1.08]), { stiffness: 140, damping: 22 });

  const glowX = useTransform(mx, [0, 1], ["10%", "90%"]);
  const glowY = useTransform(my, [0, 1], ["10%", "90%"]);

  const [pulse, setPulse] = useState(0);
  const onCardClick = () => setPulse((p) => p + 1);

  const bgY = useMotionValue(0);
  useEffect(() => {
    const onScroll = () => bgY.set(window.scrollY * 0.25);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [bgY]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-[#08131E]"
    >
      {/* Background image */}
      <motion.div className="absolute inset-0" style={{ y: bgY }} aria-hidden>
        <img
          src={HOME_BG}
          alt=""
          className="h-[120%] w-full object-cover object-center opacity-25 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071018]/85 via-[#071018]/45 to-[#08131E]/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071018]/50 via-transparent to-[#071018]" />
        <div
          className="absolute inset-0 mix-blend-screen pointer-events-none"
          style={{ background: "radial-gradient(55% 60% at 70% 40%, rgba(255,106,0,0.18), transparent 65%)" }}
        />
      </motion.div>

      {/* Giant background text */}
      <div
        className="giant-bg absolute left-0 top-1/2 w-full -translate-y-1/2 pl-2 text-left opacity-30 select-none pointer-events-none"
        aria-hidden
      >
        PORTFOLIO
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 sm:gap-12 lg:gap-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32 lg:grid-cols-[1.2fr,0.8fr]">
        {/* ===== Left: Copy ===== */}
        <div className="order-2 lg:order-1">
          <div data-reveal className="mb-4 flex items-center gap-3">
            <span className="flex items-center gap-2 rounded-full border border-ember-500/30 bg-ember-500/10 px-3.5 py-1 text-xs font-condensed uppercase tracking-[0.22em] text-ember-500">
              <span className="h-1.5 w-1.5 rounded-full bg-ember-500 animate-pulse" />
              Machine Learning Intern · FlyRank AI
            </span>
          </div>

          <motion.h1
            className="font-display leading-[0.92] tracking-tight"
            variants={headContainer}
            initial="hidden"
            animate="show"
          >
            <span className="block overflow-hidden pb-1">
              <motion.span className="block text-h1 text-white" variants={headWord}>
                Sumit
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-1">
              <motion.span className="block text-h1 text-ember-500 text-glow" variants={headWord}>
                Kumar
              </motion.span>
            </span>
          </motion.h1>

          {/* Role Rotator */}
          <div data-reveal className="mt-4 flex h-8 items-center overflow-hidden font-condensed text-lg text-white/85 sm:text-2xl">
            <AnimatePresence mode="wait">
              <motion.p
                key={roleIdx}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -24, opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <span className="text-ember-500">▸</span> {ROLES[roleIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          <p data-reveal className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-white/65">
            Turning raw data into cinematic intelligence — building RAG systems that reason, models that predict,
            and end-to-end ML applications that feel alive.
          </p>

          <div data-reveal className="mt-7 flex flex-wrap items-center gap-3.5">
            <Magnetic>
              <button
                onClick={() => scrollToId("#projects")}
                className="btn-ember group flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold"
              >
                <span>View Projects</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Magnetic>

            {onOpenResume && (
              <Magnetic>
                <button
                  onClick={onOpenResume}
                  className="group flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-xs sm:text-sm text-white/85 backdrop-blur transition-all hover:border-ember-500/60 hover:text-ember-500"
                >
                  <Eye className="h-4 w-4 text-ember-500 transition-transform group-hover:scale-110" />
                  View Resume
                </button>
              </Magnetic>
            )}

            <Magnetic>
              <a
                href={profile.resume}
                download="Sumit_Kumar_Resume.pdf"
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-xs sm:text-sm text-white/65 transition-colors hover:text-white"
              >
                <Download className="h-3.5 w-3.5" /> Download PDF
              </a>
            </Magnetic>
          </div>

          {/* Social Icons */}
          <div data-reveal className="mt-8 flex items-center gap-3">
            {[
              { icon: <Github className="h-4 w-4" />, href: "https://github.com/Sumit2003-dev", label: "GitHub" },
              { icon: <Linkedin className="h-4 w-4" />, href: "https://www.linkedin.com/in/sumit2003-dev/", label: "LinkedIn" },
              { icon: <Mail className="h-4 w-4" />, href: "mailto:sumit.ku5981@gmail.com", label: "Email" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/[0.03] text-white/65 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-ember-500/60 hover:text-ember-500 hover:shadow-glow"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ===== Right: Holographic 3D Lanyard ID Badge ===== */}
        <div data-reveal className="order-1 lg:order-2 flex justify-center items-center">
          <div className="relative w-full max-w-[320px] xs:max-w-[340px] sm:max-w-[360px] lg:max-w-[380px]">
            {/* Card Anchor Wrapper */}
            <div className="relative">
              {/* Suspended Lanyard Cord & Ring */}
              <div className="pointer-events-none absolute -top-11 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center">
                <div className="h-11 w-0.5 bg-gradient-to-b from-white/60 via-ember-500/40 to-ember-500" />
                <div className="-mt-1.5 grid h-3.5 w-3.5 place-items-center rounded-full border border-ember-500/80 bg-[#071018] shadow-glow">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember-500" />
                </div>
              </div>

              {/* Perfectly Centered 3D WebGL Sphere */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-85">
                <AiSphere3D className="h-[480px] w-[480px] sm:h-[540px] sm:w-[540px] lg:h-[580px] lg:w-[580px]" />
              </div>

              {/* Interactive 3D Card Stage */}
              <motion.div
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                onClick={onCardClick}
                style={{
                  rotateX: rX,
                  rotateY: rY,
                  rotateZ: rZ,
                  scaleX: sX,
                  scaleY: sY,
                  transformStyle: "preserve-3d",
                }}
                className="perspective-1000 relative z-10 cursor-pointer pt-3"
                whileTap={{ scale: 0.97 }}
              >
                {/* Click Pulse Wave Ring */}
                <motion.span
                  key={`ring-${pulse}`}
                  className="pointer-events-none absolute inset-0 z-30 rounded-[1.8rem] border-2 border-ember-500/80"
                  initial={{ opacity: 0.8, scale: 0.94 }}
                  animate={{ opacity: 0, scale: 1.14 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />

                {/* Main ID Badge Frame */}
                <motion.div
                  animate={{ y: [0, -6, 0], rotateZ: [0.5, -0.5, 0.5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="glass-strong relative overflow-hidden rounded-[1.8rem] border border-white/20 p-3.5 sm:p-4 shadow-2xl transition-all duration-500 hover:border-ember-500/60 hover:shadow-glow"
                  style={{
                    background: "rgba(12, 18, 28, 0.75)",
                    backdropFilter: "blur(24px)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Dynamic Mouse Cursor Holographic Spotlight */}
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-[1.8rem] opacity-60"
                    style={{
                      background: useMotionTemplate`radial-gradient(300px circle at ${glowX} ${glowY}, rgba(255,106,0,0.3), transparent 70%)`,
                    }}
                  />

                  {/* Card Top Header Bar */}
                  <div className="mb-2.5 flex items-center justify-between px-1.5 pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-ember-500 shadow-glow animate-ping" />
                      <span className="font-condensed text-[10px] uppercase tracking-[0.22em] text-ember-400 font-semibold">
                        AI ENGINEER PASS
                      </span>
                    </div>

                    {/* Gold Smart-Chip Visual */}
                    <div className="flex items-center gap-1 rounded-md border border-amber-400/40 bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-transparent px-1.5 py-0.5">
                      <Cpu className="h-3 w-3 text-amber-400" />
                      <span className="font-mono text-[8px] text-amber-300">RFID 2.0</span>
                    </div>
                  </div>

                  {/* Portrait Display Frame */}
                  <div className="relative aspect-[4/4.4] overflow-hidden rounded-[1.3rem] border border-white/10">
                    <motion.img
                      src={HOME_BG}
                      alt="Sumit Kumar — AI & Data Science Engineer"
                      loading="eager"
                      decoding="async"
                      className="h-full w-full object-cover object-center filter saturate-[1.15] contrast-[1.05]"
                      style={{ scale: imgScale }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060c14] via-[#060c14]/20 to-transparent" />

                    {/* Top Left Verified Badge */}
                    <div className="absolute left-2.5 top-2.5">
                      <span className="inline-flex items-center gap-1 rounded-full border border-ember-500/40 bg-[#060c14]/85 px-2.5 py-0.5 text-[9px] font-condensed uppercase tracking-wider text-ember-400 backdrop-blur-md">
                        <ShieldCheck className="h-3 w-3 text-ember-500" /> Verified
                      </span>
                    </div>

                    {/* Card Bottom Details Overlay */}
                    <div className="absolute inset-x-2.5 bottom-2.5 flex items-end justify-between">
                      <div className="rounded-xl bg-[#060c14]/90 px-3 py-2 backdrop-blur-xl border border-white/10 shadow-lg">
                        <p className="font-display text-sm uppercase leading-none text-white tracking-wide">
                          SUMIT KUMAR
                        </p>
                        <p className="mt-1 font-condensed text-[10px] uppercase tracking-[0.18em] text-ember-500">
                          AI & Data Science · SRMU
                        </p>
                      </div>
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary font-display text-sm text-[#120800] font-bold shadow-glow">
                        S
                      </span>
                    </div>
                  </div>

                  {/* Click Hologram Sheen Sweep */}
                  <motion.div
                    key={`shine-${pulse}`}
                    className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[1.8rem]"
                  >
                    <motion.div
                      className="h-full w-28 skew-x-[-22deg] bg-gradient-to-r from-transparent via-white/35 to-transparent"
                      initial={{ x: "-150%", opacity: 0 }}
                      animate={{ x: "350%", opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 0.95, ease: "easeInOut" }}
                    />
                  </motion.div>
                </motion.div>

                {/* Floating Parallax Chips (Responsive Offset) */}
                <motion.div
                  className="glass pointer-events-none absolute -left-2 sm:-left-3 lg:-left-4 top-8 z-30 rounded-lg px-2 py-1 backdrop-blur-xl border border-white/15 shadow-lg"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transform: "translateZ(35px)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-ember-500" />
                    <div>
                      <p className="font-display text-sm text-ember-500 text-glow leading-none">92%</p>
                      <p className="text-[8px] uppercase tracking-wider text-white/50">Accuracy</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="glass pointer-events-none absolute -right-2 sm:-right-3 lg:-right-4 top-12 z-30 rounded-lg px-2 py-1 backdrop-blur-xl border border-white/15 shadow-lg"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transform: "translateZ(50px)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <Cpu className="h-3 w-3 text-ember-500" />
                    <div>
                      <p className="font-display text-sm text-ember-500 text-glow leading-none">RAG</p>
                      <p className="text-[8px] uppercase tracking-wider text-white/50">GyanVerse</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <p className="pointer-events-none mt-5 text-center font-condensed text-[10px] uppercase tracking-[0.28em] text-white/35">
              3D Holographic ID Pass · Move cursor &amp; Click
            </p>
          </div>
        </div>
      </div>

      {/* Mouse Scroll Indicator */}
      <button
        onClick={() => scrollToId("#about")}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 transition-colors hover:text-ember-500"
        aria-label="Scroll down"
      >
        <span className="font-condensed text-[11px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="grid h-9 w-5 place-items-start justify-center rounded-full border border-white/25 p-1.5">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-ember-500"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </button>
    </section>
  );
}