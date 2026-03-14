import Link from "next/link"

const stack = [
  "Next.js", "Tailwind CSS", "shadcn/ui",
  "Clerk Auth", "Supabase", "Groq AI", "Vercel",
]

const sections = [
  {
    label: "What is ColdMail AI?",
    content: "ColdMail AI is a purpose-built cold email generator for individuals — freshers, freelancers, founders, and sales professionals. Fill a structured form, get a personalized cold email in seconds. No prompt engineering needed.",
  },
  {
    label: "Why we built it",
    content: "Most AI writing tools are built for enterprises doing bulk outreach. ColdMail AI is built for the individual — one focused email, done right.",
  },
]

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white" style={{ backgroundColor: "#0a0a0f" }}>
      <div className="pointer-events-none absolute -top-48 -left-48 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148, 163, 184, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at top, black 30%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 space-y-3">
          <p className="text-xs font-medium uppercase tracking-widest text-violet-500">
            About
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
            ColdMail <span className="text-violet-400">AI</span>
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            A focused tool for people who care about every cold email they send.
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-4">
          {sections.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.03] border-l-2 border-l-violet-500/40 p-8 transition-all duration-200 hover:border-violet-500/20 hover:bg-violet-500/[0.03]"
            >
              <h2 className="mb-3 text-lg font-semibold text-slate-100">
                {s.label}
              </h2>
              <p className="text-base leading-relaxed text-slate-400">
                {s.content}
              </p>
            </div>
          ))}

          {/* Stack */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] border-l-2 border-l-violet-500/40 p-8 transition-all duration-200 hover:border-violet-500/20 hover:bg-violet-500/[0.03]">
            <h2 className="mb-5 text-lg font-semibold text-slate-100">
              The Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Built by */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] border-l-2 border-l-violet-500/40 p-8 transition-all duration-200 hover:border-violet-500/20 hover:bg-violet-500/[0.03]">
            <h2 className="mb-3 text-lg font-semibold text-slate-100">
              Built by
            </h2>
            <p className="text-base leading-relaxed text-slate-400">
              Built by Saransh —{" "}
              <Link
                href="https://www.linkedin.com/in/saransh-kumar-188303377"
                target="_blank"
                className="text-violet-400 underline underline-offset-4 decoration-violet-500/30 hover:text-violet-300 hover:decoration-violet-400 transition-colors"
              >
                connect on LinkedIn
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-white/[0.06] pt-8">
          <p className="text-sm text-slate-600">
            © 2025 ColdMail AI. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  )
}
