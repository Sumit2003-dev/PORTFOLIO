import { useRef, useState } from "react";
import Section from "./Section";
import { profile } from "@/lib/data";
import { useFadeUp } from "@/hooks/use-scroll";
import { Mail, Phone, MapPin, Github, Linkedin, Send, Check, Sparkles, Copy } from "lucide-react";

const FIELD =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-ember-500/60";

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);
  const [draftOpened, setDraftOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ first: "", email: "", subject: "", message: "" });

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(
      formData.subject.trim() || "Portfolio Contact Inquiry"
    )}&body=${encodeURIComponent(
      `Hello Sumit,\n\nName: ${formData.first.trim()}\nEmail: ${formData.email.trim()}\n\nMessage:\n${formData.message.trim()}`
    )}`;

    try {
      window.location.href = mailtoUrl;
    } catch {
      window.open(mailtoUrl, "_self");
    }

    setDraftOpened(true);

    setTimeout(() => {
      setDraftOpened(false);
      setFormData({ first: "", email: "", subject: "", message: "" });
    }, 6000);
  };

  const info = [
    { icon: <Mail className="h-4 w-4" />, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: <Phone className="h-4 w-4" />, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, '')}` },
    { icon: <MapPin className="h-4 w-4" />, label: "Location", value: profile.location, href: undefined },
  ];

  return (
    <Section id="contact" word="CONTACT" inverted>
      <div ref={ref} className="grid gap-8 lg:gap-16 lg:grid-cols-2 items-start">
        {/* Left */}
        <div>
          <p data-reveal className="font-condensed text-xs uppercase tracking-[0.3em] text-ember-500">
            Get in touch
          </p>
          <h2 data-reveal className="mt-1.5 font-display text-huge uppercase leading-[1.05] text-white">
            Let's build
            <br />
            <span className="text-ember-500 text-glow">something</span>
          </h2>
          <p data-reveal className="mt-4 max-w-md text-sm sm:text-base leading-relaxed text-white/60">
            Have a project, a Machine Learning role, or an AI idea? I'm always excited to talk data science, RAG systems, and turning complex algorithms into products that feel alive.
          </p>

          <div data-reveal className="mt-6 space-y-3.5">
            {info.map((i) => (
              <div key={i.label} className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-ember-500">
                  {i.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] uppercase tracking-widest text-white/60">{i.label}</p>
                    {i.label === "Email" && (
                      <button
                        type="button"
                        onClick={copyEmail}
                        className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[9px] font-condensed uppercase tracking-wider text-white/70 transition-colors hover:border-ember-500/40 hover:text-ember-400"
                        title="Copy email address"
                      >
                        {copied ? (
                          <>
                            <Check className="h-2.5 w-2.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-2.5 w-2.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {i.href ? (
                    <a href={i.href} className="text-xs sm:text-sm text-white/80 transition-colors hover:text-ember-500">
                      {i.value}
                    </a>
                  ) : (
                    <p className="text-xs sm:text-sm text-white/80">{i.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div data-reveal className="mt-6 flex items-center gap-2.5">
            <a
              href={profile.social[0].href}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/60 transition-all hover:border-ember-500/60 hover:text-ember-500 hover:shadow-glow"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={profile.social[1].href}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/60 transition-all hover:border-ember-500/60 hover:text-ember-500 hover:shadow-glow"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} data-reveal className="glass space-y-3.5 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 text-ember-500 font-condensed text-xs uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" /> Direct Inquiry
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <input
                required
                aria-label="First name"
                placeholder="First name"
                className={FIELD}
                value={formData.first}
                onChange={(e) => setFormData({ ...formData, first: e.target.value })}
              />
            </div>
            <div>
              <input
                required
                aria-label="Your email address"
                placeholder="Your email"
                type="email"
                className={FIELD}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <input
            aria-label="Message subject"
            placeholder="Subject"
            required
            className={FIELD}
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />

          <textarea
            required
            aria-label="Your message or project requirements"
            placeholder="Tell me your story or project requirements…"
            rows={4}
            className={`${FIELD} resize-none`}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />

          <button
            type="submit"
            className="btn-ember group flex w-full items-center justify-center gap-2 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider"
          >
            {draftOpened ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" /> Email Draft Opened!
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />{" "}
                Open Email Draft
              </>
            )}
          </button>
          {draftOpened ? (
            <p className="text-center text-[11px] text-emerald-400 font-mono">
              Email draft opened — send it from your email application, or copy my email above.
            </p>
          ) : (
            <p className="text-center text-[11px] text-white/60">
              Opens your default mail client with a pre-filled draft. Sumit typically replies within 24 hours.
            </p>
          )}
        </form>
      </div>
    </Section>
  );
}
