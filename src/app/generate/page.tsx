"use client"

import { useState, useRef, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRight, Sparkles, Copy, Check, ArrowLeft, Zap, Target, X, RotateCcw } from "lucide-react"
import Link from "next/link"

const ROLE_DROPDOWN = [
  "Founder", "Co-Founder", "CEO", "CTO", "CFO", "Product Manager", "Engineering Manager",
  "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "UI/UX Designer", "Graphic Designer", "Data Analyst", "Data Scientist", "Marketing Manager",
  "Growth Manager", "Sales Executive", "Business Development Manager", "HR Manager", "Recruiter",
  "Content Writer", "Copywriter", "Freelancer", "Student/Fresher", "Consultant", "Social Media Manager",
  "Operations Manager", "Project Manager", "DevOps Engineer",
]

const SKILL_DROPDOWN = [
  "React", "Node.js", "Next.js", "TypeScript", "Python", "Java", "SQL", "MongoDB", "AWS", "Docker",
  "UI/UX Design", "Figma", "Tailwind CSS", "Sales", "CRM", "HubSpot", "Digital Marketing", "SEO",
  "Content Writing", "Copywriting", "Data Analysis", "Machine Learning", "Excel", "Communication",
  "Leadership", "Project Management", "Agile", "Product Strategy", "B2B Sales", "Cold Outreach",
]

const INDUSTRY_DROPDOWN = [
  "SaaS", "B2B Tech", "D2C", "Ecommerce", "Fintech", "Edtech", "Healthtech", "Agritech", "Logistics",
  "Real Estate", "Gaming", "Media", "Advertising", "Consulting", "Legal", "Healthcare", "Manufacturing",
  "Retail", "Travel", "Hospitality", "Cybersecurity", "Blockchain", "AI/ML", "Cloud Computing",
  "HR Tech", "MarTech", "PropTech", "CleanTech", "Non-profit", "Government",
]

const ROLE_SUGGESTIONS = ["Sales Executive", "Founder", "Freelancer", "Student/Fresher", "Marketing Manager", "Developer"]
const SKILL_SUGGESTIONS = ["React / Node.js", "Sales / CRM", "UI/UX Design", "Content Writing", "Data Analysis", "Digital Marketing"]
const JOB_TITLE_SUGGESTIONS = ["CEO / Founder", "HR Manager", "Engineering Manager", "Head of Marketing", "Product Manager", "Recruiter"]
const INDUSTRY_SUGGESTIONS = ["SaaS / B2B Tech", "D2C / Ecommerce", "Fintech", "Edtech", "Healthcare", "Agency"]

const GOAL_SUGGESTIONS = [
  { label: "💼 Referral for a job role", value: "Get a referral for a software engineer role at their company" },
  { label: "🎓 Internship interview", value: "Land an internship interview in their product/design team" },
  { label: "📅 Book a demo", value: "Book a 15 min demo to show how we reduce onboarding time by 40%" },
  { label: "🤝 Sales conversation", value: "Start a conversation about solving their hiring bottleneck" },
  { label: "🔗 Content collab", value: "Explore a content collaboration between our two audiences" },
  { label: "🛠️ Freelance project", value: "Get hired for a short-term UI/UX project" },
  { label: "🔍 Free audit offer", value: "Offer a free audit of their landing page as a foot in the door" },
  { label: "🌐 Networking", value: "Get 15 minutes with them to learn about their career path" },
  { label: "💡 Product feedback", value: "Ask for feedback on my product from an industry expert" },
]

type Mode = "quick" | "detailed"

type FormState = {
  recipientName: string
  companyName: string
  goal: string
  tone: string
  yourName: string
  yourRole: string
  yourCompany: string
  experienceLevel: string
  keySkills: string
  valueProp: string
  jobTitle: string
  industry: string
  emailLength: string
  specificContext: string
}

const emptyForm: FormState = {
  recipientName: "", companyName: "", goal: "", tone: "",
  yourName: "", yourRole: "", yourCompany: "", experienceLevel: "",
  keySkills: "", valueProp: "", jobTitle: "", industry: "",
  emailLength: "", specificContext: "",
}

// Shared input classes
const inputCls = "h-11 rounded-xl border border-white/[0.08] bg-white/[0.04] text-base text-slate-100 placeholder:text-slate-600 focus:border-violet-500/60 focus:bg-white/[0.06] transition-all duration-200 pr-8"
const textareaCls = "rounded-xl border border-white/[0.08] bg-white/[0.04] text-base text-slate-100 placeholder:text-slate-600 focus:border-violet-500/60 focus:bg-white/[0.06] transition-all duration-200 resize-none pr-8"
const labelCls = "text-sm font-medium text-slate-300"
const sectionLabelCls = "text-xs font-semibold uppercase tracking-widest text-violet-500 pb-1 border-b border-violet-500/20"
const chipCls = "rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-slate-400 transition-all duration-200 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-300 cursor-pointer"
const dropdownCls = "absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-white/[0.08] bg-[#12121a] py-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
const dropdownItemCls = "w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-violet-500/15 hover:text-violet-200 transition-colors duration-150"

function GeneratePageInner() {
  const [mode, setMode] = useState<Mode | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [history, setHistory] = useState<FormState[]>([])
  const [subjectLine, setSubjectLine] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false)
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false)
  const [goalDropdownOpen, setGoalDropdownOpen] = useState(false)
  const roleRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const industryRef = useRef<HTMLDivElement>(null)
  const goalRef = useRef<HTMLDivElement>(null)

  const searchParams = useSearchParams()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleDropdownOpen(false)
      if (skillsRef.current && !skillsRef.current.contains(e.target as Node)) setSkillsDropdownOpen(false)
      if (industryRef.current && !industryRef.current.contains(e.target as Node)) setIndustryDropdownOpen(false)
      if (goalRef.current && !goalRef.current.contains(e.target as Node)) setGoalDropdownOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const id = searchParams.get("id")
    if (!id) return
    async function loadEmail() {
      const res = await fetch("/api/emails")
      const data = await res.json()
      if (!res.ok) return
      const email = data.emails?.find((e: { id: string }) => e.id === id)
      if (!email) return
      setMode(email.email_mode === "detailed" ? "detailed" : "quick")
      setForm({
        recipientName: email.recipient_name ?? "",
        companyName: email.company_name ?? "",
        goal: email.goal ?? "",
        tone: email.tone ?? "",
        yourName: email.your_name ?? "",
        yourRole: email.your_role ?? "",
        yourCompany: email.your_company ?? "",
        experienceLevel: email.experience_level ?? "",
        keySkills: email.key_skills ?? "",
        valueProp: email.value_prop ?? "",
        jobTitle: email.job_title ?? "",
        industry: email.industry ?? "",
        emailLength: email.email_length ?? "",
        specificContext: email.specific_context ?? "",
      })
      setSubjectLine(email.subject_line ?? "")
      setEmailBody(email.email_body ?? "")
    }
    loadEmail()
  }, [searchParams])

  const updateField = useCallback((field: keyof FormState, value: string) => {
    setHistory((prev) => [...prev.slice(-20), form])
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [form])

  const clearField = useCallback((field: keyof FormState) => {
    setHistory((prev) => [...prev.slice(-20), form])
    setForm((prev) => ({ ...prev, [field]: "" }))
  }, [form])

  const handleUndo = useCallback(() => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setForm(prev)
  }, [history])

  async function handleGenerate() {
    if (mode === "quick" && (!form.recipientName || !form.companyName || !form.goal || !form.tone)) {
      setError("Please fill in all fields.")
      return
    }
    if (mode === "detailed" && (!form.yourName || !form.yourRole || !form.recipientName || !form.companyName || !form.goal || !form.tone || !form.emailLength || !form.experienceLevel)) {
      setError("Please fill in all mandatory fields.")
      return
    }
    setLoading(true)
    setError("")
    setSubjectLine("")
    setEmailBody("")
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, ...form }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return }
      setSubjectLine(data.subjectLine)
      setEmailBody(data.emailBody)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(`Subject: ${subjectLine}\n\n${emailBody}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const ClearBtn = ({ field }: { field: keyof FormState }) =>
    form[field] ? (
      <button type="button" onClick={() => clearField(field)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors">
        <X className="h-3.5 w-3.5" />
      </button>
    ) : null

  const ClearBtnTextarea = ({ field }: { field: keyof FormState }) =>
    form[field] ? (
      <button type="button" onClick={() => clearField(field)}
        className="absolute right-3 top-3 text-slate-600 hover:text-slate-300 transition-colors">
        <X className="h-3.5 w-3.5" />
      </button>
    ) : null

  return (
    <main className="relative min-h-screen overflow-hidden text-white" style={{ backgroundColor: "#0a0a0f" }}>
      <div className="pointer-events-none absolute -top-48 -left-48 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(148, 163, 184, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at top, black 30%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">

        {/* Back */}
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-10 space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-violet-500">Generator</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
            Generate a cold email
          </h1>
          <p className="text-base text-slate-400">
            Choose quick for fast outreach or detailed for maximum personalization.
          </p>
        </div>

        {/* Mode selector */}
        {!mode && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              onClick={() => setMode("quick")}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8 text-left transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/[0.05] hover:shadow-[0_0_30px_rgba(124,58,237,0.08)] hover:-translate-y-0.5"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                <Zap className="h-6 w-6" />
              </div>
              <p className="text-base font-semibold text-slate-100">⚡ Quick Email</p>
              <p className="mt-1.5 text-sm text-slate-500">4 fields · Ready in seconds · Best for fast outreach</p>
            </button>

            <button
              onClick={() => setMode("detailed")}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8 text-left transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/[0.05] hover:shadow-[0_0_30px_rgba(124,58,237,0.08)] hover:-translate-y-0.5"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                <Target className="h-6 w-6" />
              </div>
              <p className="text-base font-semibold text-slate-100">🎯 Detailed Email</p>
              <p className="mt-1.5 text-sm text-slate-500">12 fields · Maximum personalization · Best for serious outreach</p>
            </button>
          </div>
        )}

        {/* Form */}
        {mode && (
          <div className="space-y-6">

            {/* Mode tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setMode("quick"); setSubjectLine(""); setEmailBody(""); setError("") }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${mode === "quick" ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]" : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-slate-200"}`}
              >
                <Zap className="h-3.5 w-3.5" /> Quick
              </button>
              <button
                onClick={() => { setMode("detailed"); setSubjectLine(""); setEmailBody(""); setError("") }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${mode === "detailed" ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]" : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-slate-200"}`}
              >
                <Target className="h-3.5 w-3.5" /> Detailed
              </button>
            </div>

            {/* Form card */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8 space-y-6">

              {/* DETAILED — About You */}
              {mode === "detailed" && (
                <>
                  <p className={sectionLabelCls}>About You</p>

                  <div className="space-y-2">
                    <Label className={labelCls}>Your name <span className="text-violet-500">✱</span></Label>
                    <div className="relative">
                      <Input placeholder="e.g. Sam" value={form.yourName}
                        onChange={(e) => updateField("yourName", e.target.value)}
                        className={inputCls} />
                      <ClearBtn field="yourName" />
                    </div>
                  </div>

                  <div className="space-y-2" ref={roleRef}>
                    <Label className={labelCls}>Your role/title <span className="text-violet-500">✱</span></Label>
                    <div className="relative">
                      <Input placeholder="e.g. Founder" value={form.yourRole}
                        onChange={(e) => updateField("yourRole", e.target.value)}
                        onFocus={() => setRoleDropdownOpen(true)}
                        className={inputCls} />
                      <ClearBtn field="yourRole" />
                      {roleDropdownOpen && (
                        <ul className={dropdownCls}>
                          {ROLE_DROPDOWN.map((s) => (
                            <li key={s}>
                              <button type="button" onMouseDown={(e) => { e.preventDefault(); updateField("yourRole", s); setRoleDropdownOpen(false) }}
                                className={dropdownItemCls}>{s}</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {ROLE_SUGGESTIONS.map((s) => (
                        <button key={s} type="button" onClick={() => updateField("yourRole", s)} className={chipCls}>{s}</button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className={labelCls}>Your company <span className="text-slate-600 font-normal">(optional)</span></Label>
                    <div className="relative">
                      <Input placeholder="e.g. Acme Inc — leave blank if freelancer" value={form.yourCompany}
                        onChange={(e) => updateField("yourCompany", e.target.value)}
                        className={inputCls} />
                      <ClearBtn field="yourCompany" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className={labelCls}>Experience level <span className="text-violet-500">✱</span></Label>
                    <Select onValueChange={(v) => updateField("experienceLevel", v)} value={form.experienceLevel}>
                      <SelectTrigger className="h-11 rounded-xl border border-white/[0.08] bg-white/[0.04] text-base text-slate-100 focus:border-violet-500/60">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-white/[0.08] bg-[#12121a] text-slate-100">
                        <SelectItem value="fresher">Fresher (0–1 years)</SelectItem>
                        <SelectItem value="mid">Mid-level (2–4 years)</SelectItem>
                        <SelectItem value="senior">Senior (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2" ref={skillsRef}>
                    <Label className={labelCls}>Key skills <span className="text-slate-600 font-normal">(optional)</span></Label>
                    <div className="relative">
                      <Input placeholder="e.g. React, Sales, Design" value={form.keySkills}
                        onChange={(e) => updateField("keySkills", e.target.value)}
                        onFocus={() => setSkillsDropdownOpen(true)}
                        className={inputCls} />
                      <ClearBtn field="keySkills" />
                      {skillsDropdownOpen && (
                        <ul className={dropdownCls}>
                          {SKILL_DROPDOWN.map((s) => (
                            <li key={s}>
                              <button type="button" onMouseDown={(e) => { e.preventDefault(); updateField("keySkills", s); setSkillsDropdownOpen(false) }}
                                className={dropdownItemCls}>{s}</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {SKILL_SUGGESTIONS.map((s) => (
                        <button key={s} type="button" onClick={() => updateField("keySkills", s)} className={chipCls}>{s}</button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className={labelCls}>Your value proposition <span className="text-slate-600 font-normal">(optional)</span></Label>
                    <div className="relative">
                      <Textarea placeholder="e.g. I help SaaS teams reduce churn through better onboarding"
                        value={form.valueProp} onChange={(e) => updateField("valueProp", e.target.value)}
                        rows={2} className={textareaCls} />
                      <ClearBtnTextarea field="valueProp" />
                    </div>
                  </div>

                  <p className={sectionLabelCls}>About Them</p>
                </>
              )}

              {/* Shared fields */}
              <div className="space-y-2">
                <Label className={labelCls}>Recipient name <span className="text-violet-500">✱</span></Label>
                <div className="relative">
                  <Input placeholder="e.g. Sam Johnson" value={form.recipientName}
                    onChange={(e) => updateField("recipientName", e.target.value)}
                    className={inputCls} />
                  <ClearBtn field="recipientName" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className={labelCls}>Their company <span className="text-violet-500">✱</span></Label>
                <div className="relative">
                  <Input placeholder="e.g. Infosys" value={form.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    className={inputCls} />
                  <ClearBtn field="companyName" />
                </div>
              </div>

              {/* Detailed recipient extras */}
              {mode === "detailed" && (
                <>
                  <div className="space-y-2">
                    <Label className={labelCls}>Their job title <span className="text-slate-600 font-normal">(optional)</span></Label>
                    <div className="relative">
                      <Input placeholder="e.g. Head of Marketing" value={form.jobTitle}
                        onChange={(e) => updateField("jobTitle", e.target.value)}
                        className={inputCls} />
                      <ClearBtn field="jobTitle" />
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {JOB_TITLE_SUGGESTIONS.map((s) => (
                        <button key={s} onClick={() => updateField("jobTitle", s)} className={chipCls}>{s}</button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2" ref={industryRef}>
                    <Label className={labelCls}>Industry <span className="text-slate-600 font-normal">(optional)</span></Label>
                    <div className="relative">
                      <Input placeholder="e.g. SaaS, Fintech" value={form.industry}
                        onChange={(e) => updateField("industry", e.target.value)}
                        onFocus={() => setIndustryDropdownOpen(true)}
                        className={inputCls} />
                      <ClearBtn field="industry" />
                      {industryDropdownOpen && (
                        <ul className={dropdownCls}>
                          {INDUSTRY_DROPDOWN.map((s) => (
                            <li key={s}>
                              <button type="button" onMouseDown={(e) => { e.preventDefault(); updateField("industry", s); setIndustryDropdownOpen(false) }}
                                className={dropdownItemCls}>{s}</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {INDUSTRY_SUGGESTIONS.map((s) => (
                        <button key={s} type="button" onClick={() => updateField("industry", s)} className={chipCls}>{s}</button>
                      ))}
                    </div>
                  </div>

                  <p className={sectionLabelCls}>The Ask</p>
                </>
              )}

              {/* Goal */}
              <div className="space-y-2" ref={goalRef}>
                <Label className={labelCls}>Your goal <span className="text-violet-500">✱</span></Label>
                <div className="flex flex-wrap gap-2 pb-2">
                  {GOAL_SUGGESTIONS.map((s) => (
                    <button key={s.label} type="button" onClick={() => updateField("goal", s.value)} className={chipCls}>
                      {s.label}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Textarea
                    placeholder="e.g. Book a 15 min demo to show how we cut onboarding time by 40%"
                    value={form.goal}
                    onChange={(e) => updateField("goal", e.target.value)}
                    onFocus={() => setGoalDropdownOpen(true)}
                    rows={3}
                    className={textareaCls}
                  />
                  <ClearBtnTextarea field="goal" />
                  {goalDropdownOpen && (
                    <ul className={dropdownCls}>
                      {GOAL_SUGGESTIONS.map((s) => (
                        <li key={s.label}>
                          <button type="button"
                            onMouseDown={(e) => { e.preventDefault(); updateField("goal", s.value); setGoalDropdownOpen(false) }}
                            className={dropdownItemCls}>{s.label}</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Tone */}
              <div className="space-y-2">
                <Label className={labelCls}>Tone <span className="text-violet-500">✱</span></Label>
                <Select onValueChange={(v) => updateField("tone", v)} value={form.tone}>
                  <SelectTrigger className="h-11 rounded-xl border border-white/[0.08] bg-white/[0.04] text-base text-slate-100 focus:border-violet-500/60">
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-white/[0.08] bg-[#12121a] text-slate-100">
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="confident">Confident</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Detailed only */}
              {mode === "detailed" && (
                <>
                  <div className="space-y-2">
                    <Label className={labelCls}>Email length <span className="text-violet-500">✱</span></Label>
                    <Select onValueChange={(v) => updateField("emailLength", v)} value={form.emailLength}>
                      <SelectTrigger className="h-11 rounded-xl border border-white/[0.08] bg-white/[0.04] text-base text-slate-100 focus:border-violet-500/60">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-white/[0.08] bg-[#12121a] text-slate-100">
                        <SelectItem value="short">Short (under 100 words)</SelectItem>
                        <SelectItem value="medium">Medium (100–150 words)</SelectItem>
                        <SelectItem value="long">Long (150–200 words)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className={labelCls}>Something specific about them <span className="text-slate-600 font-normal">(optional)</span></Label>
                    <div className="relative">
                      <Textarea
                        placeholder="e.g. They just raised Series A · Recently posted about hiring struggles"
                        value={form.specificContext}
                        onChange={(e) => updateField("specificContext", e.target.value)}
                        rows={2}
                        className={textareaCls}
                      />
                      <ClearBtnTextarea field="specificContext" />
                    </div>
                  </div>
                </>
              )}

              {error && (
                <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              {/* Undo + Clear + Generate */}
              <div className="space-y-3 pt-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={history.length === 0}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-sm text-slate-400 transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/8 hover:text-slate-200 disabled:opacity-30"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Undo last change
                  </button>
                  <button
                    type="button"
                    onClick={() => { setHistory([]); setForm(emptyForm) }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-sm text-slate-400 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/8 hover:text-red-400"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear all
                  </button>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] disabled:opacity-50"
                >
                  {loading ? (
                    <><Sparkles className="h-4 w-4 animate-spin" />Generating...</>
                  ) : (
                    <>Generate Email<ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </div>

            {/* Output */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03]">
              {!subjectLine && !emailBody && !loading && (
                <div className="flex min-h-[200px] flex-col items-center justify-center space-y-3 p-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <p className="text-base font-medium text-slate-300">Your email will appear here</p>
                  <p className="text-sm text-slate-600">Fill in the form and click Generate Email.</p>
                </div>
              )}

              {loading && (
                <div className="flex min-h-[200px] flex-col items-center justify-center space-y-3 p-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                    <Sparkles className="h-7 w-7 animate-spin" />
                  </div>
                  <p className="text-base text-slate-400">Writing your email...</p>
                </div>
              )}

              {subjectLine && emailBody && (
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">Subject</p>
                    <p className="text-base font-semibold text-slate-100">{subjectLine}</p>
                  </div>
                  <div className="h-px w-full bg-white/[0.06]" />
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">Email body</p>
                    <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-300">{emailBody}</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/8 hover:text-violet-300"
                  >
                    {copied ? (
                      <><Check className="h-4 w-4 text-emerald-400" />Copied!</>
                    ) : (
                      <><Copy className="h-4 w-4" />Copy to clipboard</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function GeneratePage() {
  return (
    <Suspense>
      <GeneratePageInner />
    </Suspense>
  )
}