import { useRef, useState, useEffect } from "react";
import Section from "./Section";
import { certificates, CertificateItem, profile } from "@/lib/data";
import { useFadeUp } from "@/hooks/use-scroll";
import { Award, ExternalLink, X, Eye, Download, FileText, CheckCircle2 } from "lucide-react";
import { SiGooglecloud, SiCredly } from "react-icons/si";

export default function Certificates() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  useEffect(() => {
    if (!selectedCert) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCert(null);
    };
    window.addEventListener("keydown", onKey);

    document.body.style.overflow = "hidden";
    const lenis = window.__lenis;
    lenis?.stop();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [selectedCert]);

  return (
    <Section id="certificates" word="CERTIFICATES">
      <div ref={ref}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 data-reveal className="font-display text-huge uppercase leading-[1.05] text-white">
              Certifications<span className="text-ember-500 text-glow">.</span>
            </h2>
            <p data-reveal className="mt-3 max-w-2xl text-sm sm:text-base text-white/60">
              Verified professional credentials and job simulations from Google, NPTEL, Anthropic, IBM, TCS, TATA, and Deloitte.
            </p>
          </div>
          <div data-reveal className="flex flex-wrap items-center gap-2">
            <a
              href={profile.googleSkills}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-ember-500/30 bg-ember-500/10 px-3 py-1.5 text-xs text-ember-400 transition-all hover:border-ember-500 hover:bg-ember-500/20 hover:text-white"
              title="View live 178 Google Cloud badges on Google Skills Boost"
            >
              <SiGooglecloud className="h-3.5 w-3.5 text-ember-500" />
              <span>Google Skills (178 Badges)</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={profile.googleDev}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition-all hover:border-ember-500/50 hover:text-white"
              title="View Google Developer Profile (g.dev/sumit2003dev)"
            >
              <span>g.dev/sumit2003dev</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={profile.credly}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition-all hover:border-ember-500/50 hover:text-white"
              title="View verified Credly badges"
            >
              <SiCredly className="h-3.5 w-3.5 text-ember-500" />
              <span>Credly Badges</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/50">
              <CheckCircle2 className="h-3.5 w-3.5 text-ember-500" />
              <span>{certificates.length} Credentials</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((c) => (
            <div
              key={c.title}
              data-reveal
              role="button"
              tabIndex={0}
              aria-label={`View certificate for ${c.title}`}
              onClick={() => setSelectedCert(c)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedCert(c);
                }
              }}
              className="group glass relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl p-4 sm:p-5 text-left transition-all duration-500 hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-500"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-xl"
                    style={{ background: `hsla(${c.hue},0.18)` }}
                  >
                    <Award className="h-5 w-5" style={{ color: `hsl(${c.hue})` }} />
                  </span>
                  <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] text-white/50">
                    {c.level}
                  </span>
                </div>

                <h3 className="mt-3.5 font-display text-base uppercase leading-snug text-white transition-colors group-hover:text-ember-400">
                  {c.title}
                </h3>
                <p className="mt-1 font-condensed text-xs uppercase tracking-wider text-ember-500">
                  {c.issuer} · {c.date}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {c.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] text-white/60"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[11px] text-white/40">{c.credential}</span>
                <span className="flex items-center gap-1 text-[11px] text-ember-500 group-hover:underline">
                  <Eye className="h-3 w-3" /> View Credential
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Certificate Detail & Document Modal */}
      {selectedCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate: ${selectedCert.title}`}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#060b11]/95 p-2 sm:p-4 backdrop-blur-xl"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="glass-strong relative flex h-[80vh] w-full max-w-3xl lg:max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#08131e]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
              <div>
                <span className="font-condensed text-xs uppercase tracking-wider text-ember-500">
                  {selectedCert.issuer} · {selectedCert.date}
                </span>
                <h3 className="font-display text-lg sm:text-xl uppercase text-white">{selectedCert.title}</h3>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {selectedCert.url && (
                  <a
                    href={selectedCert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full border border-ember-500/50 bg-ember-500/15 px-3 py-1.5 text-xs font-semibold text-ember-400 transition-colors hover:bg-ember-500 hover:text-black"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Verify Live Profile
                  </a>
                )}
                {selectedCert.pdf && (
                  <>
                    <a
                      href={selectedCert.pdf}
                      download={`${selectedCert.title.replace(/\s+/g, "_")}.pdf`}
                      className="btn-ember flex items-center gap-2 px-3 py-1.5 text-xs font-semibold sm:px-4 sm:py-2"
                    >
                      <Download className="h-4 w-4" /> <span className="hidden sm:inline">Download</span> PDF
                    </a>
                    <a
                      href={selectedCert.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/80 transition-colors hover:border-ember-500 hover:text-ember-500"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Open
                    </a>
                  </>
                )}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-ember-500 hover:text-black"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Document Viewer Frame */}
            <div className="relative flex-1 bg-[#04080e] p-4 flex items-center justify-center overflow-auto">
              {selectedCert.pdf ? (
                <iframe
                  src={`${selectedCert.pdf}#toolbar=0`}
                  className="h-full w-full rounded-2xl border-none"
                  title={selectedCert.title}
                />
              ) : (
                <img
                  src={selectedCert.img}
                  alt={selectedCert.title}
                  className="max-h-full max-w-full object-contain rounded-2xl border border-white/10 shadow-2xl"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
