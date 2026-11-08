import { useEffect, useState } from "react";
import { scrollToId } from "@/hooks/use-lenis";
import { FileText, Sparkles } from "lucide-react";

const NAV = [
  { name: "HOME", href: "#home" },
  { name: "ABOUT", href: "#about" },
  { name: "EDUCATION", href: "#education" },
  { name: "SKILLS", href: "#skills" },
  { name: "WORK", href: "#projects" },
  { name: "CERTIFICATES", href: "#certificates" },
  { name: "CONTACT", href: "#contact" },
];

type NavigationProps = {
  onOpenResume?: () => void;
};

export default function Navigation({ onOpenResume }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ids = ["home", "about", "education", "skills", "projects", "certificates", "contact"];
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      let current = "#home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) current = `#${id}`;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    scrollToId(href);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.08] bg-[#060c14]/85 backdrop-blur-2xl shadow-2xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-3.5 sm:py-4">
        {/* Brand / Logo */}
        <button onClick={() => go("#home")} className="group flex items-center gap-2.5">
          <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary font-display text-sm text-[#120800] font-bold shadow-glow transition-transform group-hover:scale-105">
            S
          </span>
          <span className="font-condensed text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
            Sumit <span className="text-ember-500">Kumar</span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <button
              key={n.href}
              onClick={() => go(n.href)}
              className={`relative py-1 font-condensed text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                active === n.href ? "text-ember-500" : "text-white/60 hover:text-white"
              }`}
            >
              {n.name}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-ember-500 transition-all duration-300 ${
                  active === n.href ? "w-full opacity-100" : "w-0 opacity-0"
                }`}
              />
            </button>
          ))}

          {onOpenResume && (
            <button
              onClick={onOpenResume}
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-3.5 py-1.5 font-condensed text-xs font-medium uppercase tracking-wider text-white/80 transition-all hover:border-ember-500/60 hover:text-ember-500"
            >
              <FileText className="h-3.5 w-3.5 text-ember-500" /> Resume
            </button>
          )}

          <button
            onClick={() => go("#contact")}
            className="group flex items-center gap-2 rounded-full border border-ember-500/40 bg-ember-500/10 px-4 py-1.5 font-condensed text-xs font-semibold uppercase tracking-[0.2em] text-ember-500 transition-all hover:bg-ember-500 hover:text-[#120800] hover:shadow-glow"
          >
            <span>Let's Talk</span>
            <Sparkles className="h-3 w-3 opacity-60 group-hover:opacity-100" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 lg:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation-menu"
        >
          <div className="space-y-1.5">
            <span className={`block h-px w-5 bg-white transition-all ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-white transition-all ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 bg-white transition-all ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div
        id="mobile-navigation-menu"
        className={`lg:hidden overflow-y-auto bg-[#060c14]/95 backdrop-blur-2xl transition-all duration-500 ${
          open ? "max-h-[85vh] border-b border-white/10" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-3 px-6 py-6">
          {NAV.map((n) => (
            <button
              key={n.href}
              onClick={() => go(n.href)}
              className={`py-1.5 text-left font-condensed text-sm uppercase tracking-[0.2em] ${
                active === n.href ? "text-ember-500 font-semibold" : "text-white/70"
              }`}
            >
              {n.name}
            </button>
          ))}

          {onOpenResume && (
            <button
              onClick={() => {
                setOpen(false);
                onOpenResume();
              }}
              className="flex items-center gap-2 py-2 text-left font-condensed text-sm uppercase tracking-[0.2em] text-white/80"
            >
              <FileText className="h-4 w-4 text-ember-500" /> View Resume
            </button>
          )}
        </div>
      </div>
    </header>
  );
}