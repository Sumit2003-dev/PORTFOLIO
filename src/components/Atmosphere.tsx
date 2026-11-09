import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  life: number;
  phase: number;
};

/**
 * Floating orange dust / particle layer. Lightweight canvas, GPU-friendly with subtle density.
 */
export default function ParticleField({ density = 24 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = typeof window !== "undefined" && (window.innerWidth < 768 || "ontouchstart" in window);
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const particles: Particle[] = [];
    const DPR = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const gen = () => {
      particles.length = 0;
      const effectiveDensity = isMobile ? Math.min(density, 6) : density;
      const n = Math.min(effectiveDensity, Math.floor((w * h) / (isMobile ? 80000 : 45000)));
      for (let i = 0; i < n; i++) {
        particles.push({
          x: rand(0, w),
          y: rand(0, h),
          r: rand(0.4, 2.1),
          vx: rand(-0.08, 0.08),
          vy: rand(-0.18, -0.02),
          life: rand(0, 1),
          phase: rand(0, Math.PI * 2),
        });
      }
    };
    gen();

    const rescale = () => {
      w = canvas.width = window.innerWidth * DPR;
      h = canvas.height = window.innerHeight * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      w = window.innerWidth;
      h = window.innerHeight;
      gen();
    };
    rescale();

    let raf = 0;
    let t0 = performance.now();
    let isPaused = false;
    let startTimer = 0;

    function draw(t: number) {
      if (isPaused) return;

      const dt = Math.min((t - t0) / 1000, 0.1);
      t0 = t;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx * (dt * 60);
        p.y += p.vy * (dt * 60);
        p.phase += 0.01;
        p.life = 0.55 + 0.45 * Math.sin(p.phase);

        if (p.y < -10) { p.y = h + 10; p.x = rand(0, w); }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const alpha = p.life * 0.5;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grad.addColorStop(0, `rgba(255,138,43,${alpha})`);
        grad.addColorStop(1, "rgba(255,106,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,199,153, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    if (isMobile) {
      startTimer = window.setTimeout(() => {
        raf = requestAnimationFrame(draw);
      }, 1200);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        isPaused = true;
        cancelAnimationFrame(raf);
      } else {
        isPaused = false;
        t0 = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onResize = () => rescale();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(startTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[2] opacity-40"
      aria-hidden
    />
  );
}

/** Slow moving fog layers, lit from behind. */
export function FogField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Cinematic animated gaussian blur layers (Desktop & tablet) */}
      <div
        className="hidden md:block absolute -left-1/4 top-[-10%] h-[70vh] w-[140%] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,106,0,0.18), rgba(184,78,2,0.06) 45%, transparent 70%)",
          filter: "blur(60px)",
          animation: "drift 22s ease-in-out infinite alternate",
          mixBlendMode: "screen",
        }}
      />
      <div
        className="hidden md:block absolute -right-1/3 top-1/3 h-[60vh] w-[120%] rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(184,78,2,0.16), transparent 65%)",
          filter: "blur(70px)",
          animation: "drift 28s ease-in-out infinite alternate-reverse",
          mixBlendMode: "screen",
        }}
      />
      {/* High-performance CSS radial gradient for mobile without expensive 60px filter rasterization */}
      <div
        className="md:hidden absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 25%, rgba(255,106,0,0.14), transparent 65%)",
        }}
      />
    </div>
  );
}

/** Interactive cursor glow that follows the mouse. */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024 || "ontouchstart" in window) return;
    const el = ref.current;
    if (!el) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x, ry = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const loop = () => {
      rx += (x - rx) * 0.06;
      ry += (y - ry) * 0.06;
      el.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-glow hidden lg:block" aria-hidden />;
}
