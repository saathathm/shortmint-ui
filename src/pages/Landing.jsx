import { Link } from "react-router-dom";
import {
  Scissors,
  Zap,
  Globe,
  BarChart2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";

const DEMO_CLIPS = [
  {
    url: "https://shortmint.addmora.com/files/clip_blur.mp4",
    label: "Tamil Islamic lecture",
    style: "Blur BG",
  },
  {
    url: "https://shortmint.addmora.com/files/clip_crop.mp4",
    label: "Religious talk",
    style: "9:16 Crop",
  },
  {
    url: "https://shortmint.addmora.com/files/clip_custombg.mp4",
    label: "Same video, custom clip",
    style: "Custom",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Paste a Video link",
    description:
      "Drop in any video - lectures, podcasts, interviews, talks. Any language, any length.",
    icon: "🔗",
  },
  {
    step: "02",
    title: "AI finds the best moments",
    description:
      "Our AI transcribes the full video, identifies the 3 most powerful clips, and writes titles and descriptions for each.",
    icon: "🧠",
  },
  {
    step: "03",
    title: "Review, edit, and download",
    description:
      "Watch each clip, Take the title and description if you want, then download and post wherever you like.",
    icon: "🚀",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Works in any language",
    description:
      "Tamil, Arabic, English, Tanglish - our AI handles them all natively.",
  },
  {
    icon: Globe,
    title: "Multiple platforms",
    description:
      "Supports YouTube, Facebook, Instagram, TikTok, Vimeo, and more. Upload your own files too.",
  },
  {
    icon: BarChart2,
    title: "Made for creators",
    description:
      "Built for lectures, podcasts, interviews, and any speech-heavy content.",
  },
  {
    icon: Scissors,
    title: "3 styles",
    description:
      "Blur background, smart 9:16 crop, or upload your own custom background image.",
  },
];

const FAQS = [
  {
    q: "How long does it take?",
    a: "Most videos are ready in under 8 minutes. The shorter the section you select, the faster it goes.",
  },
  {
    q: "What languages does it work with?",
    a: "Any spoken language. English, Spanish, French, German, Arabic, Tamil, Urdu — if someone is speaking it, ShortMint can work with it.",
  },
  {
    q: "Do I need to connect any accounts?",
    a: "No. Download your clips and post them wherever you like. No accounts needed.",
  },
  {
    q: "How do hours work?",
    a: "You pay for the minutes you process, not the full video length. Select a 20-minute section — that uses 0.33 hours. Monthly plan hours reset every month. One-time hours never expire.",
  },
  {
    q: "Which platforms does it support?",
    a: "YouTube, Facebook, Instagram, TikTok, Vimeo, Rumble, Loom, Dropbox — and you can upload your own files too. Everything except the free trial.",
  },
  {
    q: "Can I upload my own video?",
    a: "Yes. Drop in any MP4, MOV, MKV, AVI, or WEBM file up to 500MB. Perfect for videos that aren't publicly available online.",
  },
  {
    q: "Can I run the same video again?",
    a: "Yes. Every run may find different moments — the AI is non-deterministic. All your clip batches are saved in History.",
  },
  {
    q: "What if I don't like the clips?",
    a: "Run it again. You'll get a fresh set of 3 clips. Each clip also has an editable title and description if you want to tweak anything before sharing.",
  },
];

const TESTIMONIALS = [
  {
    name: "Br. Ismail R.",
    role: "Islamic content creator, London",
    text: "I was spending 3-4 hours manually clipping each lecture. ShortMint does it in 8 minutes. The clips it picks are genuinely good - it understands the emotional arc of a talk.",
  },
  {
    name: "Ustadh Faaris K.",
    role: "Arabic & Tamil speaker, UK",
    text: "I was skeptical that any AI would handle Tamil and Arabic correctly. ShortMint surprised me - it transcribes Tanglish speech accurately and picks clips that make sense without context.",
  },
  {
    name: "Sister Anisa M.",
    role: "Podcast creator, Leicester",
    text: "I use it for my weekly podcast. The blur background style looks incredibly professional. My Reels engagement went up the week I started using ShortMint.",
  },
];

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left gap-4"
      >
        <span className="font-semibold text-text-primary text-sm">{q}</span>
        {open ? (
          <ChevronUp size={18} className="text-text-muted shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-text-muted shrink-0" />
        )}
      </button>
      {open && (
        <p className="text-sm text-text-muted mt-3 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

function DemoClip({ clip }) {
  return (
    <div
      className="relative bg-gray-100 rounded-2xl overflow-hidden"
      style={{ aspectRatio: "9/16" }}
    >
      <video
        src={clip.url}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute bottom-3 left-3 right-3">
        <span className="bg-black/90 text-white text-xs font-semibold px-2 py-1 rounded-lg">
          {clip.style}
        </span>
      </div>
    </div>
  );
}

export default function Landing() {
  const { isAuthenticated, client, initialized } = useAuth();
  const hasActivePlan =
    isAuthenticated && client?.plan && client.plan !== "trial";
  return (
    <div className="-mt-8">
      {/* Hero */}
      <section className="py-20 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 bg-bg-secondary border border-blue-100 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <Zap size={12} /> AI-powered · Works in any language
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight tracking-tight mb-4">
          Turn long videos into
          <br />
          <span className="text-primary">viral Shorts</span> – in minutes
        </h1>
        <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          ShortMint uses AI to find the 3 best clips in any lecture, podcast, or
          interview. Download and share them anywhere — YouTube Shorts, Facebook
          Reels, TikTok, and more.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {!initialized ? null : hasActivePlan ? (
            <Link to="/dashboard" className="btn-primary text-base py-3.5 px-8">
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn-primary text-base py-3.5 px-8">
                Start for free →
              </Link>
              <Link
                to="/pricing"
                className="btn-secondary text-base py-3.5 px-8"
              >
                See pricing
              </Link>
            </>
          )}
        </div>
        {initialized && !hasActivePlan && (
          <p className="text-xs text-text-dim mt-4">
            No credit card required to sign up
          </p>
        )}
      </section>

      {/* Demo clips */}
      <section className="py-12 bg-bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-text-primary mb-2">
            Real outputs from ShortMint
          </h2>
          <p className="text-center text-text-muted text-sm mb-8">
            These clips were generated automatically from podcasts
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-0 gap-6 max-w-2xl mx-auto">
            {DEMO_CLIPS.map((clip, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-center w-full sm:w-auto"
              >
                <div className="w-44 sm:w-52">
                  <DemoClip clip={clip} />
                </div>
                {i < DEMO_CLIPS.length - 1 && (
                  <>
                    {/* Vertical divider — desktop only */}
                    <div className="hidden sm:block w-px h-64 bg-border mx-4 self-center opacity-60" />
                    {/* Horizontal divider — mobile only */}
                    <div className="block sm:hidden w-24 h-px bg-border my-2 opacity-60" />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <h2 className="text-center text-2xl font-bold text-text-primary mb-10">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="text-center">
              <div className="text-3xl mb-3">{step.icon}</div>
              <p className="text-xs font-bold text-text-dim uppercase tracking-widest mb-1">
                {step.step}
              </p>
              <h3 className="font-bold text-text-primary mb-2">{step.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-text-primary mb-10">
            Built for serious creators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-bg-secondary rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-16 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Honest, simple pricing
        </h2>
        <p className="text-text-muted text-sm mb-6">
          Pay for the hours you process. No hidden fees.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {[
            {
              label: "Starter",
              monthlyPrice: "$29",
              oneTimePrice: "$35",
              hours: "10 hours",
            },
            {
              label: "Growth",
              monthlyPrice: "$59",
              oneTimePrice: "$69",
              hours: "25 hours",
              popular: true,
            },
            {
              label: "Pro",
              monthlyPrice: "$99",
              oneTimePrice: "$115",
              hours: "60 hours",
            },
          ].map((p) => (
            <div
              key={p.label}
              className={`card p-5 w-44 ${p.popular ? "border-primary border-2" : ""}`}
            >
              {p.popular && (
                <p className="text-xs font-bold text-primary mb-1">
                  Most popular
                </p>
              )}
              <p className="font-bold text-text-primary">{p.label}</p>
              <p className="text-2xl font-extrabold text-text-primary mt-1">
                {p.monthlyPrice}
                <span className="text-sm font-normal text-text-muted">/mo</span>
              </p>
              <p className="text-xs text-text-muted">
                or {p.oneTimePrice} one-time
              </p>
              <p className="text-xs text-text-muted mt-1">{p.hours}</p>
            </div>
          ))}
        </div>
        <Link to="/pricing" className="btn-primary inline-block mt-6">
          View all plans →
        </Link>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-text-primary mb-10">
            What creators are saying
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-5">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-text-primary leading-relaxed mb-4">
                  "{t.text}"
                </p>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {t.name}
                  </p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 max-w-2xl mx-auto px-4">
        <h2 className="text-center text-2xl font-bold text-text-primary mb-8">
          Frequently asked questions
        </h2>
        <div>
          {FAQS.map((faq) => (
            <FAQ key={faq.q} {...faq} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-text-primary mb-3">
          Ready to grow your channel?
        </h2>
        <p className="text-text-muted mb-6">
          Join creators already using ShortMint to publish consistently without
          the editing grind.
        </p>
        {!initialized ? null : hasActivePlan ? (
          <Link
            to="/dashboard"
            className="btn-primary text-base py-3.5 px-8 inline-flex items-center gap-2"
          >
            <Sparkles size={18} /> Go to Dashboard
          </Link>
        ) : (
          <Link
            to="/signup"
            className="btn-primary text-base py-3.5 px-8 inline-flex items-center gap-2"
          >
            <CheckCircle size={18} /> Start for free - no credit card needed
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
              <Scissors size={12} className="text-white" />
            </div>
            <span className="font-bold text-text-primary">ShortMint</span>
            <span className="text-text-dim text-sm">by Addmora</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-text-muted">
            <Link
              to="/pricing"
              className="hover:text-text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/privacy"
              className="hover:text-text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <a
              href="mailto:hello@addmora.com"
              className="hover:text-text-primary transition-colors"
            >
              Support
            </a>
            <span className="text-text-dim">© 2026 Addmora</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
