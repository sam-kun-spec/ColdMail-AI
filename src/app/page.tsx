import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SignInButton, SignUpButton, Show } from "@clerk/nextjs"
import {
  Mail,
  Zap,
  Clock,
  Copy,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Zap,
    title: "Purpose-built, not generic",
    description:
      "A flow designed solely for cold outreach, so every field maps to a line that actually converts.",
  },
  {
    icon: ShieldCheck,
    title: "On-brand and human",
    description:
      "Tone controls keep your emails confident but not cringe, with guardrails against spammy phrasing.",
  },
  {
    icon: BarChart3,
    title: "Save & iterate",
    description:
      "Keep a history of what you ship, learn what works, and refine your best-performing sequences.",
  },
]

const steps = [
  {
    step: "01",
    title: "Tell us who you're reaching out to",
    description:
      "Share your role, target persona, and what you want out of the conversation.",
  },
  {
    step: "02",
    title: "We generate a tailored cold email",
    description:
      "Under the hood, prompt engineering and templates tuned for response rate—not word count.",
  },
  {
    step: "03",
    title: "Copy, personalize, send",
    description:
      "Fine-tune the last 5%, paste into your inbox, and start more real conversations.",
  },
]

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white" style={{ backgroundColor: "#0a0a0f" }}>

      {/* Single subtle glow — top left only */}
      <div className="pointer-events-none absolute -top-48 -left-48 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-3xl" />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148, 163, 184, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at top, black 30%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-32">

        {/* Hero */}
        <section className="grid flex-1 grid-cols-1 items-center gap-16 lg:grid-cols-2">

          {/* Left */}
          <div className="space-y-10">
            {/* Badge */}
            <div className="flex w-fit items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/8 px-4 py-1.5">
              <Sparkles className="h-3 w-3 text-violet-400" />
              <span className="text-xs font-medium text-violet-300 tracking-wide">New · AI Cold Email Generator</span>
            </div>

            {/* Headline */}
            <div className="space-y-5">
              <h1 className="text-left text-5xl font-bold leading-[1.1] tracking-tighter text-slate-50 sm:text-6xl lg:text-7xl">
                Write cold emails
                <span className="block mt-1 bg-gradient-to-r from-violet-400 via-purple-300 to-slate-300 bg-clip-text text-transparent">
                  that get replies.
                </span>
              </h1>
              {/* Divider line */}
              <div className="h-px w-32 bg-gradient-to-r from-violet-500/60 to-transparent" />
              <p className="max-w-lg text-left text-base leading-relaxed text-slate-400 sm:text-lg">
                Purpose-built AI for outbound. Fill a structured form, get a
                personalized cold email in seconds — no prompt engineering needed.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Show when="signed-out">
                <SignUpButton>
                  <Button
                    size="lg"
                    className="rounded-xl bg-violet-600 px-6 text-white hover:bg-violet-500 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-all duration-200 font-medium"
                  >
                    Get started free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </SignUpButton>
                <SignInButton>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl border-white/10 bg-white/[0.04] text-slate-300 hover:border-violet-500/40 hover:bg-violet-500/8 hover:text-white transition-all duration-200"
                  >
                    Sign in
                  </Button>
                </SignInButton>
              </Show>

              <Show when="signed-in">
                <Link href="/generate">
                  <Button
                    size="lg"
                    className="rounded-xl bg-violet-600 px-6 text-white hover:bg-violet-500 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-all duration-200 font-medium"
                  >
                    Generate your next email
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Show>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-violet-500" />
                <span>No credit card required</span>
              </div>
              <div className="h-3.5 w-px bg-slate-700" />
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-violet-500" />
                <span>Generate in just a few seconds</span>
              </div>
            </div>
          </div>

          {/* Right — email preview card */}
          <div className="relative">
            <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-violet-500/15 blur-3xl" />
            <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] p-6 space-y-5">

              {/* Email header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-xs font-bold">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100">You →</p>
                    <p className="text-xs text-slate-500">Head of Growth @ Acme</p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  34% reply rate
                </span>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-white/[0.06]" />

              {/* Email content */}
              <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600">Subject</span>
                  <span className="text-xs text-slate-300">Quick idea to warm up your outbound in Q2</span>
                </div>
                <div className="h-px w-full bg-white/[0.05]" />
                <div className="space-y-2 text-xs leading-relaxed text-slate-400">
                  <p>Hey Sam, I noticed your team is doubling down on outbound this quarter, but your reps are still writing emails from scratch.</p>
                  <p>We&apos;ve been helping teams like Linear and Notion turn a simple brief into on-brand cold emails in seconds—without the &quot;ChatGPT&quot; feel.</p>
                  <p>Would you be open to a 15-minute walkthrough?</p>
                  <p className="text-slate-600">Best, <span className="text-slate-300 font-medium">Alex</span></p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Copy className="h-3.5 w-3.5 text-violet-500" />
                  <span>One-click copy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  <span>Gmail &amp; Outlook</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-32 space-y-12">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-widest text-violet-500">Why ColdMail AI</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
              Built for modern outbound.
            </h2>
            <p className="max-w-xl text-base text-slate-400 leading-relaxed">
              Every decision here is tuned to get more positive replies, not longer emails.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8 transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/[0.05] hover:shadow-[0_0_30px_rgba(124,58,237,0.08)] hover:-translate-y-0.5"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-slate-100">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-32 space-y-12">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-widest text-violet-500">Process</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
              How it works
            </h2>
            <p className="max-w-xl text-base text-slate-400 leading-relaxed">
              From idea to send-ready cold email in three steps — no prompt engineering needed.
            </p>
          </div>

          <div className="space-y-3">
            {steps.map((step, i) => (
              <div
                key={step.step}
                className="group flex items-start gap-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8 transition-all duration-200 hover:border-violet-500/20 hover:bg-violet-500/[0.04]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 text-sm font-bold text-violet-400">
                  {i + 1}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-slate-100">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mt-32">
          <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950 via-violet-900/80 to-indigo-950 p-10 sm:p-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.3),transparent_60%)]" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Ready to ship your next cold email?
                </h2>
                <p className="max-w-xl text-base text-violet-200/70">
                  Start free. No credit card. Generate your first email in seconds.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Show when="signed-out">
                  <SignUpButton>
                    <Button
                      size="lg"
                      className="rounded-xl bg-white px-8 text-violet-700 hover:bg-slate-100 font-semibold transition-all duration-200"
                    >
                      Get started free
                    </Button>
                  </SignUpButton>
                  <SignInButton>
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
                    >
                      Sign in
                    </Button>
                  </SignInButton>
                </Show>

                <Show when="signed-in">
                  <Link href="/generate">
                    <Button
                      size="lg"
                      className="rounded-xl bg-white px-8 text-violet-700 hover:bg-slate-100 font-semibold transition-all duration-200"
                    >
                      Go to generator
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Show>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-white/[0.06] pt-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-300">
                ColdMail <span className="text-violet-400">AI</span>
              </p>
              <p className="text-xs text-slate-600">© 2026 ColdMail AI. All rights reserved.</p>
            </div>
            <nav className="flex flex-wrap gap-6 text-sm text-slate-500">
              <Link href="/about" className="transition-colors hover:text-slate-200">
                About
              </Link>
              <Link href="/feedback" className="transition-colors hover:text-slate-200">
                Feedback
              </Link>
            </nav>
          </div>
        </footer>

      </div>
    </main>
  )
}
