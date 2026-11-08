import { useEffect } from "react";
import { X, Download, ExternalLink, FileText } from "lucide-react";
import { profile } from "@/lib/data";

type ResumeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Resume document preview"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="glass-strong relative flex h-[82vh] w-full max-w-3xl lg:max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#08131e]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 sm:px-5 sm:py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-ember-500/20 text-ember-500">
              <FileText className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-base uppercase text-white">Sumit Kumar — Resume</h3>
              <p className="text-[10px] text-white/50">Data Scientist & AI Engineer</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={profile.resume}
              download="Sumit_Kumar_Resume.pdf"
              className="btn-ember flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
            >
              <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Download</span> PDF
            </a>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/80 transition-colors hover:border-ember-500 hover:text-ember-500"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open
            </a>
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-ember-500 hover:text-black"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Embedded PDF iframe / viewer fallback */}
        <div className="relative flex-1 bg-[#101822]">
          <iframe
            src={`${profile.resume}#toolbar=0`}
            className="h-full w-full border-none"
            title="Sumit Kumar Resume PDF"
          />
        </div>
      </div>
    </div>
  );
}
