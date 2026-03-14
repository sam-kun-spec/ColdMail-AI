"use client"

import { useState } from "react"
import { CheckCircle, Mail } from "lucide-react"

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = new FormData(form)
    await fetch("https://formspree.io/f/mbdzkpgq", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    })
    setLoading(false)
    setSubmitted(true)
  }

  const inputCls = "w-full h-11 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-base text-slate-100 placeholder:text-slate-600 focus:border-violet-500/60 focus:bg-white/[0.06] focus:outline-none transition-all duration-200"
  const labelCls = "block mb-2 text-sm font-medium text-slate-300"

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

      <div className="relative mx-auto max-w-xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 space-y-3">
          <p className="text-xs font-medium uppercase tracking-widest text-violet-500">
            Feedback
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-50">
            Share your thoughts
          </h1>
          <p className="text-base text-slate-400">
            Found a bug? Have a suggestion? We read every message.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-8 py-16 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="h-7 w-7" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-100">
              Thanks for your feedback!
            </h2>
            <p className="text-base text-slate-500">
              We'll get back to you soon.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className={labelCls}>Name</label>
                <input
                  name="name"
                  required
                  placeholder="Your name"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Message</label>
                <textarea
                  name="message"
                  required
                  placeholder="Tell us what you think..."
                  rows={5}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-base text-slate-100 placeholder:text-slate-600 focus:border-violet-500/60 focus:bg-white/[0.06] focus:outline-none transition-all duration-200 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-violet-600 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Feedback"}
              </button>
            </form>
          </div>
        )}

        <div className="mt-8 flex items-center gap-2 text-sm text-slate-600">
          <Mail className="h-3.5 w-3.5" />
          <span>Or email us at{" "}
            <a href="mailto:shivaa99099@gmail.com" className="text-slate-500 hover:text-slate-300 transition-colors">
              shivaa99099@gmail.com
            </a>
          </span>
        </div>
      </div>
    </main>
  )
}