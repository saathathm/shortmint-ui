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
    title: "Paste a link or upload",
    description:
      "YouTube, TikTok, Instagram, Facebook, Vimeo – or just upload your own video file. Any platform, any language.",
    icon: "🔗",
  },
  {
    step: "02",
    title: "AI does the work",
    description:
      "ShortMint listens to your video, finds the 3 most powerful moments, and writes a title and description for each one. You don't lift a finger.",
    icon: "🧠",
  },
  {
    step: "03",
    title: "Download and post",
    description:
      "Your clips are ready in minutes – cropped, styled, and formatted for Shorts and Reels. Download and post wherever you want.",
    icon: "🚀",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Works in any language",
    description:
      "English, Arabic, Tamil, French, Spanish, Urdu – ShortMint understands whatever is spoken. Most tools only work well in English.",
  },
  {
    icon: Globe,
    title: "Every major platform",
    description:
      "YouTube, TikTok, Instagram, Facebook, Vimeo, Rumble, Loom, Dropbox – or upload your own file. One tool for everything.",
  },
  {
    icon: BarChart2,
    title: "No editing skills needed",
    description:
      "If you can click a button, you can use ShortMint. No timelines, no software, no learning curve. Anyone can do it.",
  },
  {
    icon: Scissors,
    title: "Three professional styles",
    description:
      "Blur background, smart crop, or your own custom image behind the video. Your clips look professionally made – automatically.",
  },
];

const WHY_SHORTMINT = [
  {
    icon: "😌",
    title: "No confusion. Just paste and go.",
    desc: "Other tools overwhelm you with settings, timelines, and options. ShortMint has one job – find your best moments and hand them to you. That is it.",
  },
  {
    icon: "🌍",
    title: "Works in your language",
    desc: "Arabic, Tamil, French, Spanish, Urdu – most competitors only handle English well. ShortMint works natively in any spoken language.",
  },
  {
    icon: "💳",
    title: "Pay once, use forever",
    desc: "Don't want a monthly bill? Buy hours once and they never expire. Most tools lock you into a subscription – we give you the choice.",
  },
  {
    icon: "📁",
    title: "Upload any video",
    desc: "Not everything is on YouTube. Upload your own MP4, MOV, or MKV file directly – no public link needed.",
  },
  {
    icon: "⚡",
    title: "Ready in minutes",
    desc: "Most videos are clipped and ready to download in under 8 minutes. No waiting hours. No queue.",
  },
  {
    icon: "🔒",
    title: "7-day money-back guarantee",
    desc: "Not happy? Email us within 7 days and we'll refund you in full. No questions, no hassle.",
  },
];

const FAQS = [
  {
    q: "How long does it take?",
    a: "Most videos are ready in under 8 minutes. The shorter the section you select, the faster it goes.",
  },
  {
    q: "What languages does it work with?",
    a: "Any spoken language. English, Spanish, French, German, Arabic, Tamil, Urdu – if someone is speaking it, ShortMint can work with it.",
  },
  {
    q: "Do I need to connect any accounts?",
    a: "No. Download your clips and post them wherever you like. No accounts needed.",
  },
  {
    q: "How do hours work?",
    a: "You pay for the minutes you process, not the full video length. Select a 20-minute section – that uses 0.33 hours. Monthly plan hours reset every month. One-time hours never expire.",
  },
  {
    q: "Which platforms does it support?",
    a: "YouTube, Facebook, Instagram, TikTok, Vimeo, Rumble, Loom, Dropbox – and you can upload your own files too. Everything except the free trial.",
  },
  {
    q: "Can I upload my own video?",
    a: "Yes. Drop in any MP4, MOV, MKV, AVI, or WEBM file up to 500MB. Perfect for videos that aren't publicly available online.",
  },
  {
    q: "Can I run the same video again?",
    a: "Yes. Every run may find different moments – the AI is non-deterministic. All your clip batches are saved in History.",
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
    text: "I used to spend 3-4 hours cutting each lecture by hand. Now I paste the link and walk away. ShortMint picks better clips than I do.",
  },
  {
    name: "Ustadh Faaris K.",
    role: "Arabic & Tamil speaker, UK",
    text: "I tried other tools but they mangled my Arabic. ShortMint gets it right every time – even Tanglish. It actually understands what is being said.",
  },
  {
    name: "Sister Anisa M.",
    role: "Podcast creator, Leicester",
    text: "The blur background style looks so clean on Reels. My audience thinks I have a video editor. I just use ShortMint.",
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
          <Zap size={12} /> Simpler than any tool you've tried
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight tracking-tight mb-4">
          Your long videos,
          <br />
          <span className="text-primary">Shorts in minutes</span>
        </h1>
        <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Most video tools are overcomplicated. ShortMint isn't. Paste a link.
          Pick a style. Done – clips ready in minutes, in any language.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {!initialized ? null : hasActivePlan ? (
            <Link to="/dashboard" className="btn-primary text-base py-3.5 px-8">
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn-primary text-base py-3.5 px-8">
                Try it free →
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
          <div className="mt-5 flex items-center justify-center gap-6 flex-wrap">
            <span className="text-xs text-text-muted flex items-center gap-1.5">
              <CheckCircle size={13} className="text-success" /> 15 min free –
              no card needed
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1.5">
              <CheckCircle size={13} className="text-success" /> 7-day
              money-back guarantee
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1.5">
              <CheckCircle size={13} className="text-success" /> Cancel anytime
            </span>
          </div>
        )}
      </section>

      {/* Demo clips */}
      <section className="py-12 bg-bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-text-primary mb-2">
            Real outputs from ShortMint
          </h2>
          <p className="text-center text-text-muted text-sm mb-8">
            These clips were generated automatically – no editing involved
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
                    <div className="hidden sm:block w-px h-64 bg-border mx-4 self-center opacity-60" />
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
        <h2 className="text-center text-2xl font-bold text-text-primary mb-3">
          Three steps. That's it.
        </h2>
        <p className="text-center text-text-muted text-sm mb-10">
          No tutorials. No learning curve. Anyone can do this.
        </p>
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
          <h2 className="text-center text-2xl font-bold text-text-primary mb-3">
            Everything you need. Nothing you don't.
          </h2>
          <p className="text-center text-text-muted text-sm mb-10">
            Built for creators who want results, not complexity.
          </p>
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

      {/* Why ShortMint */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <h2 className="text-center text-2xl font-bold text-text-primary mb-3">
          Why creators choose ShortMint
        </h2>
        <p className="text-center text-text-muted text-sm mb-10">
          There are other tools out there. Here's what makes ShortMint
          different.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {WHY_SHORTMINT.map((item) => (
            <div key={item.title} className="card p-5 flex items-start gap-4">
              <div className="text-2xl shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Free trial highlight */}
      <section className="py-10 max-w-2xl mx-auto px-4 text-center">
        <div className="card p-6 border-2 border-dashed border-primary/30 bg-bg-secondary">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
            Free to start
          </p>
          <h3 className="text-xl font-bold text-text-primary mb-2">
            Try before you pay – no card needed
          </h3>
          <p className="text-sm text-text-muted mb-4">
            Every new account gets{" "}
            <strong>15 minutes of free processing</strong>. That's enough to
            turn a real video into 3 ready-to-post Shorts – completely free.
          </p>
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="btn-primary text-sm py-2.5 px-6 inline-block"
            >
              Start free – no card needed
            </Link>
          )}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-16 bg-bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Honest, simple pricing
          </h2>
          <p className="text-text-muted text-sm mb-2">
            Pay only for what you process. No hidden fees. Cancel anytime.
          </p>
          <p className="text-text-muted text-sm mb-8">
            Don't want a subscription? Buy hours once – they never expire.
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
                  <span className="text-sm font-normal text-text-muted">
                    /mo
                  </span>
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
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 max-w-4xl mx-auto px-4">
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
          Stop leaving content on the table
        </h2>
        <p className="text-text-muted mb-2">
          Every long video you post has 3 great Shorts hiding inside it.
        </p>
        <p className="text-text-muted mb-8">
          ShortMint finds them for you – in minutes, in any language, with no
          editing skills needed.
        </p>
        {!initialized ? null : hasActivePlan ? (
          <Link
            to="/dashboard"
            className="btn-primary text-base py-3.5 px-8 inline-flex items-center gap-2"
          >
            <Sparkles size={18} /> Go to Dashboard
          </Link>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Link
              to="/signup"
              className="btn-primary text-base py-3.5 px-8 inline-flex items-center gap-2"
            >
              <CheckCircle size={18} /> Try it free – no card needed
            </Link>
            <p className="text-xs text-text-dim">
              7-day money-back guarantee on all paid plans
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
