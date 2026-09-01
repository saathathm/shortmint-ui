import { Link } from "react-router-dom";
import { CheckCircle, Zap, Scissors, Clock } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

const TOOLS_COMPARISON = [
  {
    feature: "Finds the best moments automatically",
    shorttrim: true,
    others: false,
  },
  {
    feature: "Works in any language",
    shorttrim: true,
    others: false,
  },
  {
    feature: "Writes titles and descriptions for you",
    shorttrim: true,
    others: false,
  },
  {
    feature: "2–3 clips per video (not just one)",
    shorttrim: true,
    others: false,
  },
  {
    feature: "No timeline editor or learning curve",
    shorttrim: true,
    others: false,
  },
  {
    feature: "Ready in under 8 minutes",
    shorttrim: true,
    others: true,
  },
  {
    feature: "Supports YouTube, Facebook, Instagram, uploads",
    shorttrim: true,
    others: true,
  },
];

const FAQS = [
  {
    q: "What is AI video clipping?",
    a: "AI video clipping is when an AI tool watches or listens to a long video and automatically finds the best moments to turn into short clips – without you having to do it manually. Instead of watching your video again and cutting it yourself, the AI does that work for you.",
  },
  {
    q: "How does ShortTrim decide which moments to clip?",
    a: "ShortTrim listens to what's being said in the video and looks for moments that would work well as standalone short clips – strong statements, interesting points, engaging stories. It picks 2–3 of the best ones per video.",
  },
  {
    q: "Is AI video clipping accurate?",
    a: "It's not perfect – no AI tool is. But ShortTrim consistently finds genuinely good moments, not random cuts. And if you don't like a set of clips, you can run the same video again and get a fresh set.",
  },
  {
    q: "Does it work for non-English videos?",
    a: "Yes. ShortTrim works in any spoken language – Arabic, Tamil, French, Spanish, Urdu, German, and more. Most AI video clippers are built for English only. ShortTrim actually understands what's being said regardless of the language.",
  },
  {
    q: "Do I need any video editing experience?",
    a: "None at all. You paste a link, pick a section, pick a style, and wait. The clips come out already formatted for Shorts – no timeline, no editing, no exporting.",
  },
  {
    q: "How much does it cost?",
    a: "There's a 7-day free trial with 10 hours of processing included. After that, plans start from $19/month. You can also buy hours once – they never expire.",
  },
];

export default function AiVideoClipping() {
  const { isAuthenticated, client, initialized } = useAuth();
  const hasActivePlan =
    isAuthenticated && client?.plan && client.plan !== "trial";

  return (
    <div className="-mt-8">
      {/* Hero */}
      <section className="py-20 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 bg-bg-secondary border border-blue-100 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <Scissors size={12} /> No editing skills needed
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight tracking-tight mb-4">
          AI video clipping –
          <br />
          <span className="text-primary">done in minutes, not hours</span>
        </h1>

        <p className="text-text-muted text-lg mb-4 max-w-xl mx-auto leading-relaxed">
          Finding the best moments in a long video used to mean watching it
          again, taking notes, opening an editor, cutting, resizing, exporting.
          Over and over.
        </p>
        <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          ShortTrim does all of that automatically.{" "}
          <span className="text-primary font-semibold">
            Paste a link. Get 2–3 clips. Ready in minutes.
          </span>
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
          <p className="text-xs text-text-dim mt-4">
            7-day free trial · 10 hours included · Cancel before day 7, no
            charge
          </p>
        )}
      </section>

      {/* What AI clipping actually means */}
      <section className="py-16 bg-bg-surface border-y border-border">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            What "AI video clipping" actually means
          </h2>
          <div className="space-y-4 text-text-muted text-base leading-relaxed">
            <p>It sounds technical. It's not.</p>
            <p>
              You have a long video – an hour-long lecture, a 45-minute podcast,
              a full interview. Somewhere inside it, there are 2 or 3 really
              good 60-second moments. The kind of moment that, if someone saw it
              on their feed, they'd stop scrolling.
            </p>
            <p>
              Normally, finding those moments means watching the whole video
              again. Then cutting them out in a video editor. Then resizing to
              9:16. Then writing titles. That's 2–3 hours of work per video.
            </p>
            <p className="font-semibold text-text-primary">
              AI video clipping means a tool does all of that for you. It
              listens to the video, finds the best moments, cuts them, formats
              them, and hands them to you ready to post.
            </p>
            <p>That's what ShortTrim does. And it takes under 8 minutes.</p>
          </div>
        </div>
      </section>

      {/* How ShortTrim clips */}
      <section className="py-16 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-text-primary mb-3 text-center">
          How ShortTrim clips your videos
        </h2>
        <p className="text-center text-text-muted text-sm mb-10">
          No settings to configure. No learning curve. Just this.
        </p>

        <div className="space-y-4">
          {[
            {
              step: "01",
              title: "Paste a link or upload a file",
              body: "YouTube, Facebook, Instagram, TikTok, Vimeo, Rumble, Loom, Dropbox – or upload your own MP4 or MOV file directly. Whatever you have, it works.",
            },
            {
              step: "02",
              title: "Pick the section you want to clip",
              body: "You don't have to process the whole video. If the good stuff is in the first 20 minutes, just pick that. It saves time and processing hours.",
            },
            {
              step: "03",
              title: "Choose a background style",
              body: "Blur background, smart crop to fill the frame, or upload your own custom image. All three look professional – pick whichever fits your content.",
            },
            {
              step: "04",
              title: "Get your clips",
              body: "ShortTrim listens to the video, finds 2–3 of the strongest moments, cuts them, formats them to 9:16, writes a title and description for each one, and hands them to you. Download and post.",
            },
          ].map((item) => (
            <div key={item.step} className="card p-5 flex items-start gap-4">
              <div className="text-xs font-bold text-primary uppercase tracking-widest shrink-0 mt-1 w-6">
                {item.step}
              </div>
              <div>
                <h3 className="font-bold text-text-primary mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 bg-bg-surface border-y border-border">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-text-primary mb-3 text-center">
            How ShortTrim compares to other AI clippers
          </h2>
          <p className="text-center text-text-muted text-sm mb-8">
            There are other tools out there. Here's the honest difference.
          </p>

          <div className="card overflow-hidden">
            <div className="grid grid-cols-3 bg-bg-secondary px-4 py-3 border-b border-border">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wide col-span-1">
                Feature
              </p>
              <p className="text-xs font-bold text-primary uppercase tracking-wide text-center">
                ShortTrim
              </p>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wide text-center">
                Most others
              </p>
            </div>
            {TOOLS_COMPARISON.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 px-4 py-3 items-center ${
                  i < TOOLS_COMPARISON.length - 1
                    ? "border-b border-border"
                    : ""
                }`}
              >
                <p className="text-xs text-text-muted col-span-1 leading-relaxed pr-4">
                  {row.feature}
                </p>
                <div className="flex justify-center">
                  {row.shorttrim ? (
                    <CheckCircle size={16} className="text-success" />
                  ) : (
                    <span className="text-text-dim text-sm">✗</span>
                  )}
                </div>
                <div className="flex justify-center">
                  {row.others ? (
                    <CheckCircle size={16} className="text-success" />
                  ) : (
                    <span className="text-text-dim text-sm">✗</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Language section */}
      <section className="py-16 max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-3">
          Most AI clippers only work in English
        </h2>
        <p className="text-text-muted text-sm leading-relaxed mb-4 max-w-xl mx-auto">
          If your content is in Arabic, Tamil, French, Spanish, or Urdu – most
          tools either fail completely or do a poor job. They're built for
          English speakers.
        </p>
        <p className="text-text-muted text-sm leading-relaxed max-w-xl mx-auto">
          ShortTrim was built to work in any spoken language from day one. It
          understands what's being said – not just what language it is – which
          means it finds genuinely good moments in any video, regardless of
          language.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {[
            "English",
            "Arabic",
            "Tamil",
            "French",
            "Spanish",
            "Urdu",
            "German",
            "And more...",
          ].map((lang) => (
            <span
              key={lang}
              className="bg-bg-secondary border border-border text-text-muted text-xs font-medium px-3 py-1.5 rounded-full"
            >
              {lang}
            </span>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16 bg-bg-surface border-y border-border">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-text-primary mb-3 text-center">
            Who uses AI video clipping
          </h2>
          <p className="text-center text-text-muted text-sm mb-10">
            Anyone who makes long videos and wants more content from the same
            recording
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: "🎙️",
                title: "Podcasters",
                desc: "Every episode has 3–4 moments that would work as Shorts. AI clipping finds them without you having to rewatch anything.",
              },
              {
                icon: "📚",
                title: "Educators and lecturers",
                desc: "Long lessons have powerful moments inside them. Clip them automatically and reach people who wouldn't sit through the full lecture.",
              },
              {
                icon: "🕌",
                title: "Islamic content creators",
                desc: "Khutbahs and lectures in Arabic, Urdu, or Tamil clip beautifully. ShortTrim actually understands the language – it doesn't just guess.",
              },
              {
                icon: "🎤",
                title: "Interviewers",
                desc: "Every interview has 3–5 moments where the guest says something genuinely interesting. AI clipping finds them and cuts them for you.",
              },
              {
                icon: "📹",
                title: "YouTubers with existing content",
                desc: "You already have hours of videos sitting on YouTube. Each one has Shorts hiding inside it. AI clipping gets them out without rewatching.",
              },
              {
                icon: "🏢",
                title: "Businesses and coaches",
                desc: "Webinars, training sessions, talks – any long-form content can become short clips that find new audiences on Shorts and Reels.",
              },
            ].map((item) => (
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
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 max-w-3xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
          {[
            {
              icon: <Clock size={24} className="text-primary mx-auto mb-2" />,
              stat: "Under 8 min",
              label: "to get your clips",
              desc: "Most videos are processed and ready to download in under 8 minutes.",
            },
            {
              icon: (
                <Scissors size={24} className="text-primary mx-auto mb-2" />
              ),
              stat: "2–3 clips",
              label: "per video",
              desc: "Not just one. ShortTrim finds multiple strong moments every time.",
            },
            {
              icon: <Zap size={24} className="text-primary mx-auto mb-2" />,
              stat: "0 editing",
              label: "required",
              desc: "Clips come out formatted, styled, and ready to post. Nothing to edit.",
            },
          ].map((item, i) => (
            <div key={i} className="card p-6">
              {item.icon}
              <p className="text-3xl font-extrabold text-text-primary">
                {item.stat}
              </p>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                {item.label}
              </p>
              <p className="text-xs text-text-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-bg-surface border-y border-border">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            Questions about AI video clipping
          </h2>
          <div className="space-y-5">
            {FAQS.map((faq, i) => (
              <div key={i} className="card p-5">
                <p className="font-semibold text-text-primary mb-2 text-sm">
                  {faq.q}
                </p>
                <p className="text-sm text-text-muted leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: FAQS.map((faq) => ({
                  "@type": "Question",
                  name: faq.q,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.a,
                  },
                })),
              }),
            }}
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-text-primary mb-3">
          Stop watching your own videos to find clips
        </h2>
        <p className="text-text-muted mb-2">
          Let the AI do it. Paste your link, get 2–3 clips, post them.
        </p>
        <p className="text-text-muted mb-8">
          The whole thing takes less time than watching one episode of a
          podcast.
        </p>

        {!initialized ? null : hasActivePlan ? (
          <Link
            to="/dashboard"
            className="btn-primary text-base py-3.5 px-8 inline-block"
          >
            Go to Dashboard →
          </Link>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Link
              to="/signup"
              className="btn-primary text-base py-3.5 px-8 inline-flex items-center gap-2"
            >
              <CheckCircle size={18} /> Start your free trial →
            </Link>
            <p className="text-xs text-text-dim">
              7-day free trial · 10 hours included · Cancel anytime
            </p>
          </div>
        )}
      </section>
    </div>
  );
}