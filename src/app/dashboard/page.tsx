"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Mail,
  Calendar,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Trash2,
} from "lucide-react"

type Email = {
  id: string
  created_at: string
  recipient_name: string
  company_name: string
  goal: string
  tone: string
  subject_line: string
  email_body: string
}

export default function DashboardPage() {
  const { user } = useUser()
  const firstName = user?.firstName ?? "there"

  const router = useRouter()

  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchEmails = useCallback(async () => {
    try {
      const res = await fetch("/api/emails")
      const data = await res.json()
      if (res.ok) setEmails(data.emails ?? [])
    } catch {
      console.error("Failed to fetch emails")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEmails()
  }, [fetchEmails])

  async function handleCopy(email: Email) {
    const full = `Subject: ${email.subject_line}\n\n${email.email_body}`
    await navigator.clipboard.writeText(full)
    setCopiedId(email.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch("/api/emails", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (res.ok) setEmails((prev) => prev.filter((e) => e.id !== id))
    } catch {
      console.error("Failed to delete email")
    } finally {
      setDeletingId(null)
    }
  }

  const totalEmails = emails.length
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const thisWeek = emails.filter((e) => new Date(e.created_at) > oneWeekAgo).length
  const toneCount: Record<string, number> = {}
  emails.forEach((e) => { toneCount[e.tone] = (toneCount[e.tone] ?? 0) + 1 })
  const mostUsedTone = Object.entries(toneCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—"

  return (
    <main className="relative min-h-screen overflow-hidden text-white" style={{ backgroundColor: "#0a0a0f" }}>

      {/* Single glow */}
      <div className="pointer-events-none absolute -top-48 -left-48 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-3xl" />

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148, 163, 184, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at top, black 30%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-violet-500">
              Dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
              Welcome back, {firstName}
            </h1>
            <p className="text-base text-slate-400">
              Track your cold email performance and generate your next outreach.
            </p>
          </div>

          <Link href="/generate" className="shrink-0">
            <Button
              size="lg"
              className="rounded-xl bg-violet-600 px-6 text-white hover:bg-violet-500 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-all duration-200 font-medium"
            >
              Generate New Email
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              label: "Total Emails Generated",
              value: loading ? "—" : totalEmails,
              icon: Mail,
            },
            {
              label: "This Week",
              value: loading ? "—" : thisWeek,
              icon: Calendar,
            },
            {
              label: "Most Used Tone",
              value: loading ? "—" : mostUsedTone,
              icon: Sparkles,
              capitalize: true,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/[0.05] hover:shadow-[0_0_30px_rgba(124,58,237,0.08)] hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                    {stat.label}
                  </p>
                  <p className={`text-4xl font-bold text-slate-50 ${stat.capitalize ? "capitalize" : ""}`}>
                    {stat.value}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent emails */}
        <div className="mt-14 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-slate-50 sm:text-2xl">
              Recent emails
            </h2>
            <p className="text-base text-slate-400">
              Your generated emails — copy or delete anytime.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Sparkles className="h-6 w-6 animate-spin text-violet-400" />
            </div>
          )}

          {/* Empty state */}
          {!loading && emails.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                <Mail className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-100">
                No emails yet
              </h3>
              <p className="mb-8 text-base text-slate-500">
                Generate your first cold email to get started.
              </p>
              <Link href="/generate">
                <Button
                  size="lg"
                  className="rounded-xl bg-violet-600 px-8 text-white hover:bg-violet-500 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-all duration-200 font-medium"
                >
                  Generate Now
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}

          {/* Email cards */}
          {!loading && emails.length > 0 && (
            <div className="space-y-3">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className="group cursor-pointer rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 transition-all duration-200 hover:border-violet-500/20 hover:bg-violet-500/[0.04] hover:shadow-[0_0_25px_rgba(124,58,237,0.06)] border-l-2 border-l-violet-500/40"
                  onClick={(e) => {
                    const target = e.target as HTMLElement
                    if (target.closest("button")) return
                    router.push(`/generate?id=${email.id}`)
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-2">
                      <p className="text-base font-semibold text-slate-100 leading-snug">
                        {email.subject_line}
                      </p>
                      <p className="text-sm text-slate-500">
                        To: <span className="text-slate-400">{email.recipient_name}</span>
                        {" · "}
                        <span className="text-slate-400">{email.company_name}</span>
                        {" · "}
                        <span className="capitalize text-slate-400">{email.tone}</span>
                        {" · "}
                        {new Date(email.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm leading-relaxed text-slate-500 line-clamp-2">
                        {email.email_body}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => handleCopy(email)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-slate-400 transition-all duration-200 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-400"
                      >
                        {copiedId === email.id ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(email.id)}
                        disabled={deletingId === email.id}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-slate-400 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
