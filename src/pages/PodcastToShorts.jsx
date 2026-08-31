import { Link } from "react-router-dom";
import { CheckCircle, Zap, Globe, Mic } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

const STEPS = [
  {
    icon: "🎙️",
    title: "Paste your podcast link or upload the file",
    body: "YouTube, Spotify (via YouTube upload), Facebook, or your own MP4/MOV file. If it's a recording of someone talking, ShortTrim can work with it.",
  },
  {
    icon: "⏱️",
    title: "Pick the section you want to clip",
    body: "You don't have to process the whole episode. If the best conversations happen in the first 30 minutes, just select that. Saves time and processing hours.",
  },
  {
    icon: "🧠",
    title: "AI listens and finds the best moments",
    body: "ShortTrim listens to the conversation. It finds the moments where someone says something surprising, powerful, or genuinely interesting – the kind of thing that makes you stop scrolling.",
  },
  {
    icon: "📱",
    title: "Get 2–3 clips ready to post",
    body: "Each clip comes out in 9:16 format with a title and description already written. Download and post to YouTube Shorts, Instagram Reels, or TikTok.",
  },
];

const FAQS = [
  {
    q: "What podcast formats does it support?",
    a: "If your podcast is on YouTube – or you upload the video file directly – ShortTrim can clip it. Paste the YouTube link or upload an MP4, MOV, or MKV file up to 500MB.",
  },
  {
    q: "What if my podcast is just audio, no video?",
    a: "ShortTrim works best with video. If you record your podcast with a camera – even just a simple webcam setup – you'll get better results. Audio-only files aren't supported yet.",
  },
  {
    q: "Will it work if my podcast is in another language?",
    a: "Yes. ShortTrim works in any spoken language – English, Arabic, Tamil, French, Spanish, Urdu, and more. The AI understands what's being said regardless of the language.",
  },
  {
    q: "How long does it take?",
    a: "Usually under 8 minutes. If you select a shorter section of the episode, it goes faster.",
  },
  {
    q: "What if the clips it picks aren't the ones I wanted?",
    a: "Run it again. The AI looks at the video fresh each time and may pick different moments. You can also run the same section multiple times to get different options.",
  },
  {
    q: "Do I need any editing skills?",
    a: "None at all. The clips come out already cropped to 9:16, with a background style applied and a title written. You just download and upload.",
  },
];

export default function PodcastToShorts() {
  const { isAuthenticated, client, initialized } = useAuth();
  const hasActivePlan =
    isAuthenticated && client?.plan && client.plan !== "trial";

  return (
    <div className="-mt-8">
      {/* Hero */}
      <section className="py-20 text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 bg-bg-secondary border border-blue-100 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <Mic size={12} /> Turn one episode into a week of content
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight tracking-tight mb-4">
          Turn your podcast
          <br />
          <span className="text-primary">into viral Shorts automatically</span>
        </h1>

        <p className="text-text-muted text-lg mb-4 max-w-xl mx-auto leading-relaxed">
          Every podcast episode has 2–3 moments that would do really well as a
          Short. A surprising stat. A strong opinion. A story that lands
          perfectly in 60 seconds.
        </p>
        <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Finding those moments and cutting them out used to take hours.{" "}
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
            The problem with podcasts and short-form content
          </h2>
          <div className="space-y-4 text-text-muted text-base leading-relaxed">
            <p>
              You record a great episode. An hour of real conversation, real
              insights, real stories. You upload it to YouTube and post it.
            </p>
            <p>
              Then someone tells you – "you should be posting Shorts from your
              podcast, that's how you grow."
            </p>
            <p>And they're right. But then you actually try to do it.</p>
            <p>
              You have to listen back through the episode to find the good bits.
              Then open a video editor. Import the file. Trim the clip. Resize
              it to 9:16. Add a background. Export it. Write a title. And do
              that 3 times if you want 3 clips.
            </p>
            <p className="font-semibold text-text-primary">
              That's easily 2–3 hours of extra work per episode. For most
              podcasters, it just doesn't happen.
            </p>
            <p>
              So the good moments – the ones that would have pulled thousands of
              new listeners in – stay buried inside the full episode. Unwatched.
            </p>
          </div>
        </div>
      </section>

      {/* What ShortTrim does */}
      <section className="py-16 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-text-primary mb-3 text-center">
          How ShortTrim clips your podcast
        </h2>
        <p className="text-center text-text-muted text-sm mb-10 max-w-xl mx-auto">
          No editing. No timeline. No watching the whole episode again. Just
          paste and go.
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

      {/* What you get */}
      <section className="py-16 bg-bg-surface border-y border-border">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-text-primary mb-3 text-center">
            What you get from every episode
          </h2>
          <p className="text-center text-text-muted text-sm mb-8">
            This is what comes out for every podcast you process
          </p>
          <div className="space-y-3">
            {[
              "2–3 clips already trimmed – the strongest moments from the conversation",
              "Already in 9:16 format – ready for YouTube Shorts, Instagram Reels, TikTok",
              "A background style applied – blur, smart crop, or your own custom image",
              "A title written for each clip – just copy and paste",
              "A description written for each clip – ready to post",
              "A reason explaining why each moment was chosen",
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
            One episode. 8 minutes. 3 clips ready to post.
          </p>
        </div>
      </section>

      {/* The maths */}
      <section className="py-16 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-text-primary mb-3 text-center">
          What this actually does for your podcast growth
        </h2>
        <p className="text-center text-text-muted text-sm mb-10 max-w-xl mx-auto">
          This isn't just about saving time. It's about what consistent
          short-form content does for your audience over months.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              number: "3–5x",
              label: "more content from the same episode",
              desc: "One recording session gives you the full episode AND 2–3 Shorts. That's multiple pieces of content from one hour of talking.",
            },
            {
              number: "New",
              label: "listeners every week",
              desc: "Shorts reach people who've never heard of your podcast before. Some of them will click through and subscribe.",
            },
            {
              number: "8 min",
              label: "instead of 2–3 hours",
              desc: "That's the difference between doing it consistently and never finding the time to do it at all.",
            },
          ].map((item, i) => (
            <div key={i} className="card p-5 text-center">
              <p className="text-3xl font-extrabold text-primary mb-1">
                {item.number}
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

      {/* Language section */}
      <section className="py-16 bg-bg-surface border-y border-border">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Globe size={32} className="text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            Works in any language
          </h2>
          <p className="text-text-muted text-sm leading-relaxed mb-4 max-w-xl mx-auto">
            Most AI clipping tools are built for English podcasts. If your show
            is in Arabic, Tamil, Urdu, or French – they either don't work or
            give you completely wrong clips.
          </p>
          <p className="text-text-muted text-sm leading-relaxed max-w-xl mx-auto">
            ShortTrim actually understands what's being said in any language. So
            whether you're running an Arabic Islamic podcast, a Tamil
            educational show, or a French interview series – it works just as
            well as it does for English content.
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
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-text-primary mb-3 text-center">
          Who this is for
        </h2>
        <p className="text-center text-text-muted text-sm mb-10">
          If any of these sound like you, ShortTrim will save you a lot of time
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: "🎙️",
              title: "Podcasters with video episodes",
              desc: "You record with a camera – even just a webcam. You have hours of episodes sitting on YouTube that have never been clipped.",
            },
            {
              icon: "🕌",
              title: "Islamic content creators",
              desc: "You record khutbahs, lectures, or talks. There are always powerful 60-second moments in there. ShortTrim finds them – in Arabic, Urdu, or English.",
            },
            {
              icon: "📚",
              title: "Educators and coaches",
              desc: "You record long lessons or Q&A sessions. The best moments – the ones that really land – make perfect Shorts.",
            },
            {
              icon: "🎤",
              title: "Interviewers",
              desc: "Every interview has 3–4 moments where the guest says something genuinely interesting. ShortTrim finds those moments automatically.",
            },
          ].map((item, i) => (
            <div key={i} className="card p-5 flex items-start gap-4">
              <div className="text-2xl shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1 text-sm">
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
          Your next Short is already in your last episode
        </h2>
        <p className="text-text-muted mb-2">
          You just haven't found it yet. ShortTrim will – in minutes.
        </p>
        <p className="text-text-muted mb-8">
          Paste your podcast link. Pick a section. Get 2–3 clips ready to post.
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