import { X, Download, ExternalLink, FileText } from "lucide-react";
import { profile } from "@/lib/data";

type ResumeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="glass-strong relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#08131e]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-ember-500/20 text-ember-500">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg uppercase text-white">Sumit Kumar — Resume</h3>
              <p className="text-xs text-white/50">Data Scientist & AI Engineer</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={profile.resume}
              download="Sumit_Kumar_Resume.pdf"
              className="btn-ember flex items-center gap-2 px-4 py-2 text-xs font-semibold"
            >
              <Download className="h-4 w-4" /> Download PDF
            </a>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-white/80 transition-colors hover:border-ember-500 hover:text-ember-500"
            >
              <ExternalLink className="h-4 w-4" /> Open New Tab
            </a>
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-ember-500 hover:text-black"
            >
              <X className="h-5 w-5" />
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
