import { useRef, useState } from "react";
import Section from "./Section";
import { certificates, CertificateItem } from "@/lib/data";
import { useFadeUp } from "@/hooks/use-scroll";
import { Award, ExternalLink, X, Eye, Download, FileText, CheckCircle2 } from "lucide-react";

export default function Certificates() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  return (
    <Section id="certificates" word="CERTIFICATES">
      <div ref={ref}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 data-reveal className="font-display text-huge uppercase leading-[1.05] text-white">
              Certifications<span className="text-ember-500 text-glow">.</span>
            </h2>
            <p data-reveal className="mt-4 max-w-2xl text-lg text-white/55">
              Verified professional credentials and job simulations from Google, NPTEL, Anthropic, IBM, TCS, TATA, and Deloitte.
            </p>
          </div>
          <div data-reveal className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-white/60">
            <CheckCircle2 className="h-4 w-4 text-ember-500" />
            <span>{certificates.length} Verified Credentials</span>
          </div>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((c) => (
            <div
              key={c.title}
              data-reveal
              onClick={() => setSelectedCert(c)}
              className="group glass relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:border-ember-500/40 hover:shadow-glow"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-2xl"
                    style={{ background: `hsla(${c.hue},0.18)` }}
                  >
                    <Award className="h-6 w-6" style={{ color: `hsl(${c.hue})` }} />
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
                    {c.level}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-xl uppercase leading-tight text-white transition-colors group-hover:text-ember-400">
                  {c.title}
                </h3>
                <p className="mt-2 font-condensed text-sm uppercase tracking-widest text-ember-500">
                  {c.issuer} · {c.date}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/10 bg-black/20 px-2.5 py-0.5 text-[11px] text-white/60"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-xs text-white/40">{c.credential}</span>
                <span className="flex items-center gap-1.5 text-xs text-ember-500 group-hover:underline">
                  <Eye className="h-3.5 w-3.5" /> View Credential
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Certificate Detail & Document Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#060b11]/95 p-4 backdrop-blur-xl"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="glass-strong relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#08131e]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <span className="font-condensed text-xs uppercase tracking-wider text-ember-500">
                  {selectedCert.issuer} · {selectedCert.date}
                </span>
                <h3 className="font-display text-xl uppercase text-white">{selectedCert.title}</h3>
              </div>

              <div className="flex items-center gap-3">
                {selectedCert.pdf && (
                  <a
                    href={selectedCert.pdf}
                    download={`${selectedCert.title.replace(/\s+/g, "_")}.pdf`}
                    className="btn-ember flex items-center gap-2 px-4 py-2 text-xs font-semibold"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
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
