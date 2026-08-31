import { Link } from "react-router-dom";
import { CheckCircle, Zap, Clock, Globe } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

const STEPS = [
  {
    icon: "🔗",
    title: "Paste your YouTube link",
    body: "Any YouTube video works. A 2-hour lecture, a 45-minute podcast, a full interview – paste the link and you're done with step one.",
  },
  {
    icon: "⏱️",
    title: "Pick the part you want",
    body: "You don't have to process the whole video. Just tell ShortTrim which section to focus on – start time to end time. This saves your processing hours.",
  },
  {
    icon: "🧠",
    title: "AI finds the best moments",
    body: "ShortTrim listens to what's being said. It finds the 2–3 moments that would actually make someone stop scrolling – not just random cuts.",
  },
  {
    icon: "📱",
    title: "Download and post",
    body: "Your clips come out in 9:16 format, ready for YouTube Shorts. With a title and description already written. Just download and upload.",
  },
];

const FAQS = [
  {
    q: "Does it work with any YouTube video?",
    a: "Yes. Public YouTube videos work straight away. Just paste the link – ShortTrim handles the rest.",
  },
  {
    q: "What if the video is in Arabic or Tamil or another language?",
    a: "ShortTrim works in any spoken language. English, Arabic, Tamil, French, Spanish, Urdu – if someone is talking in the video, ShortTrim can understand it and find the best clips.",
  },
  {
    q: "How long does it take?",
    a: "Usually under 8 minutes. If you select a shorter section of the video, it goes even faster.",
  },
  {
    q: "Do I need to edit anything after?",
    a: "No. The clips come out ready to post – already in 9:16 format with a background style applied. The title and description are written for you too.",
  },
  {
    q: "What if I don't like the clips it picks?",
    a: "Run it again. Each time the AI looks at the video fresh and may find different moments. You can also run the same section multiple times.",
  },
];

export default function YoutubeToShorts() {
  const { isAuthenticated, client, initialized } = useAuth();
  const hasActivePlan =
    isAuthenticated && client?.plan && client.plan !== "trial";

  return (
    <div className="-mt-8">
      {/* Hero */}
      <section className="py-20 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 bg-bg-secondary border border-blue-100 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <Zap size={12} /> Works in any language
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight tracking-tight mb-4">
          Turn any YouTube video
          <br />
          <span className="text-primary">into Shorts automatically</span>
        </h1>

        <p className="text-text-muted text-lg mb-4 max-w-xl mx-auto leading-relaxed">
          You've got a long YouTube video. Maybe a lecture, a podcast episode, a
          full interview. There are good moments in there – moments that would
          do really well as Shorts.
        </p>
        <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          The problem is finding them and cutting them out takes hours.{" "}
          <span className="text-primary font-semibold">
            ShortTrim does it in minutes.
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
            7-day free trial · Cancel before day 7 and you won't be charged
          </p>
        )}
      </section>

      {/* The real problem */}
      <section className="py-16 bg-bg-surface border-y border-border">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Here's the problem most creators have
          </h2>
          <div className="space-y-4 text-text-muted text-base leading-relaxed">
            <p>
              You record a great lecture or interview. An hour long, maybe more.
              You post the full thing on YouTube.
            </p>
            <p>
              Then you think – "I should cut some clips from this for Shorts."
            </p>
            <p>
              But then you have to watch it again. Find the good bits. Open a
              video editor. Crop it to 9:16. Export it. Write a title. And do
              that 3 times if you want 3 clips.
            </p>
            <p className="font-semibold text-text-primary">
              That's 2–3 hours of work. For 3 clips. And most people just don't
              do it.
            </p>
            <p>
              So those good moments – the ones that would have got thousands of
              views – just sit inside the long video. Unwatched.
            </p>
          </div>
        </div>
      </section>

      {/* What ShortTrim does */}
      <section className="py-16 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-text-primary mb-3 text-center">
          What ShortTrim actually does
        </h2>
        <p className="text-center text-text-muted text-sm mb-10 max-w-xl mx-auto">
          No editing. No timelines. No learning curve. Just paste a link and get
          clips.
        </p>
        <div className="space-y-6">
          {STEPS.map((step, i) => (
            <div key={i} className="card p-5 flex items-start gap-4">
              <div className="text-3xl shrink-0">{step.icon}</div>
              <div>
                <h3 className="font-bold text-text-primary mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What you actually get */}
      <section className="py-16 bg-bg-surface border-y border-border">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-text-primary mb-3 text-center">
            What comes out the other end
          </h2>
          <p className="text-center text-text-muted text-sm mb-8">
            This is what you get for every video you process
          </p>
          <div className="space-y-3">
            {[
              "2–3 clips already cut and trimmed – the best moments, not random ones",
              "Each clip is already in 9:16 format – ready for YouTube Shorts",
              "A background style applied – blur, crop, or your own custom image",
              "A title written for you – just copy and paste",
              "A description written for you – ready to post",
              "A reason for why each clip was chosen – so you understand the pick",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle
                  size={16}
                  className="text-success shrink-0 mt-0.5"
                />
                <p className="text-sm text-text-muted leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm text-text-muted mt-6 italic text-center">
            All of that from one YouTube link. In under 8 minutes.
          </p>
        </div>
      </section>

      {/* Language section */}
      <section className="py-16 max-w-2xl mx-auto px-4 text-center">
        <Globe size={32} className="text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-text-primary mb-3">
          Works in your language – not just English
        </h2>
        <p className="text-text-muted text-sm leading-relaxed mb-4 max-w-xl mx-auto">
          Most AI video tools are built for English content. If your video is in
          Arabic, Tamil, Urdu, French, or Spanish – they struggle or just get it
          wrong.
        </p>
        <p className="text-text-muted text-sm leading-relaxed max-w-xl mx-auto">
          ShortTrim actually understands what's being said in any language. So
          if you're creating Islamic lectures in Arabic, Tamil educational
          content, or anything else – it works just as well.
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

      {/* Time saved */}
      <section className="py-16 bg-bg-surface border-y border-border">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            What this actually saves you
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: <Clock size={24} className="text-primary" />,
                stat: "2–3 hours",
                label: "saved per video",
                desc: "That's how long manual clipping takes. ShortTrim does it in under 8 minutes.",
              },
              {
                icon: <Zap size={24} className="text-primary" />,
                stat: "2–3 clips",
                label: "per video processed",
                desc: "Most tools give you one clip. ShortTrim finds multiple good moments in every video.",
              },
              {
                icon: <CheckCircle size={24} className="text-primary" />,
                stat: "0 skills",
                label: "needed",
                desc: "No editing experience. No software. If you can paste a link, you can use ShortTrim.",
              },
            ].map((item, i) => (
              <div key={i} className="card p-5 text-center">
                <div className="flex justify-center mb-3">{item.icon}</div>
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
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 max-w-2xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
          Questions people usually ask
        </h2>
        <div className="space-y-5">
          {FAQS.map((faq, i) => (
            <div key={i} className="card p-5">
              <p className="font-semibold text-text-primary mb-2 text-sm">
                {faq.q}
              </p>
              <p className="text-sm text-text-muted leading-relaxed">{faq.a}</p>
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
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-text-primary mb-3">
          Your next Short is already in that video
        </h2>
        <p className="text-text-muted mb-2">
          You just haven't found it yet. ShortTrim will – in minutes.
        </p>
        <p className="text-text-muted mb-8">
          Paste your YouTube link. Pick a section. Get 2–3 clips ready to post.
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
