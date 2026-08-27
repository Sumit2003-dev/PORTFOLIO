import { useRef, useState } from "react";
import Section from "./Section";
import { profile } from "@/lib/data";
import { useFadeUp } from "@/hooks/use-scroll";
import { Mail, Phone, MapPin, Github, Linkedin, Send, Check, Sparkles } from "lucide-react";

const FIELD =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-ember-500/60";

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ first: "", email: "", subject: "", message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ first: "", email: "", subject: "", message: "" });
    }, 4000);
  };

  const info = [
    { icon: <Mail className="h-5 w-5" />, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: <Phone className="h-5 w-5" />, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, '')}` },
    { icon: <MapPin className="h-5 w-5" />, label: "Location", value: profile.location, href: undefined },
  ];

  return (
    <Section id="contact" word="CONTACT" inverted>
      <div ref={ref} className="grid gap-12 lg:grid-cols-2">
        {/* Left */}
        <div>
          <p data-reveal className="font-condensed text-sm uppercase tracking-[0.3em] text-ember-500">
            Get in touch
          </p>
          <h2 data-reveal className="mt-2 font-display text-huge uppercase leading-[1.05] text-white">
            Let's build
            <br />
            <span className="text-ember-500 text-glow">something</span>
          </h2>
          <p data-reveal className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
            Have a project, a Machine Learning role, or an AI idea? I'm always excited to talk data science, RAG systems, and turning complex algorithms into products that feel alive.
          </p>

          <div data-reveal className="mt-9 space-y-5">
            {info.map((i) => (
              <div key={i.label} className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-ember-500">
                  {i.icon}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">{i.label}</p>
                  {i.href ? (
                    <a href={i.href} className="text-white/80 transition-colors hover:text-ember-500">
                      {i.value}
                    </a>
                  ) : (
                    <p className="text-white/80">{i.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div data-reveal className="mt-8 flex items-center gap-3">
            <a
              href={profile.social[0].href}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white/60 transition-all hover:border-ember-500/60 hover:text-ember-500 hover:shadow-glow"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={profile.social[1].href}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white/60 transition-all hover:border-ember-500/60 hover:text-ember-500 hover:shadow-glow"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} data-reveal className="glass space-y-5 rounded-3xl p-7 sm:p-9">
          <div className="flex items-center gap-2 text-ember-500 font-condensed text-xs uppercase tracking-widest">
            <Sparkles className="h-4 w-4" /> Direct Inquiry
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <input
                required
                placeholder="First name"
                className={FIELD}
                value={formData.first}
                onChange={(e) => setFormData({ ...formData, first: e.target.value })}
              />
            </div>
            <div>
              <input
                required
                placeholder="Your email"
                type="email"
                className={FIELD}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <input
            placeholder="Subject"
            required
            className={FIELD}
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />

          <textarea
            required
            placeholder="Tell me your story or project requirements…"
            rows={6}
            className={`${FIELD} resize-none`}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />

          <button
            type="submit"
            className="btn-ember group flex w-full items-center justify-center gap-2 py-4 text-sm font-bold uppercase tracking-wider"
          >
            {sent ? (
              <>
                <Check className="h-5 w-5" /> Message Sent Successfully!
              </>
            ) : (
              <>
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />{" "}
                Send Message
              </>
            )}
          </button>
          <p className="text-center text-xs text-white/35">
            Sumit typically replies within 24 hours.
          </p>
        </form>
      </div>
    </Section>
  );
}
