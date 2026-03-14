import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"
import { supabaseAdmin } from "@/lib/supabase-server"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const {
    mode,
    recipientName, companyName, goal, tone,
    yourName, yourRole, yourCompany,
    experienceLevel, keySkills, valueProp,
    jobTitle, industry, emailLength, specificContext,
  } = await req.json()

  if (!recipientName || !companyName || !goal || !tone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Build prompt based on mode
  const prompt = mode === "detailed"
    ? `You are an expert cold email copywriter.

SENDER:
- Name: ${yourName}
- Role: ${yourRole}${yourCompany ? ` at ${yourCompany}` : ""}
- Experience: ${experienceLevel}
${keySkills ? `- Key skills: ${keySkills}` : ""}
- Value proposition: ${valueProp}

RECIPIENT:
- Name: ${recipientName}
${jobTitle ? `- Title: ${jobTitle}` : ""} at ${companyName}
${industry ? `- Industry: ${industry}` : ""}

GOAL: ${goal}
TONE: ${tone}
LENGTH: ${emailLength}
${specificContext ? `PERSONAL CONTEXT: ${specificContext}` : ""}

Rules:
- Open with something specific to them, not a generic opener
- Reference sender's background naturally
- End with one clear low-friction CTA
- Sound human, not like a template
- Match the requested length strictly
- Return ONLY valid JSON:
{
  "subjectLine": "subject here",
  "emailBody": "full email body here"
}`
    : `You are an expert cold email copywriter. Write a cold email:

- Recipient: ${recipientName} at ${companyName}
- Goal: ${goal}
- Tone: ${tone}

Rules:
- Under 120 words
- No generic openers like "I hope this email finds you well"
- Be specific and human
- End with a clear low-friction CTA
- Return ONLY valid JSON:
{
  "subjectLine": "subject here",
  "emailBody": "full email body here"
}`

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    })

    const raw = completion.choices[0].message.content ?? ""
    const cleaned = raw.replace(/```json|```/g, "").trim()
    const parsed = JSON.parse(cleaned)

    const subjectLine = parsed.subjectLine
    const emailBody = parsed.emailBody

    // Save to Supabase
    const { error: dbError } = await supabaseAdmin.from("emails").insert({
      user_id: userId,
      email_mode: mode,
      recipient_name: recipientName,
      company_name: companyName,
      goal,
      tone,
      subject_line: subjectLine,
      email_body: emailBody,
      your_name: yourName || null,
      your_role: yourRole || null,
      your_company: yourCompany || null,
      experience_level: experienceLevel || null,
      key_skills: keySkills || null,
      value_prop: valueProp || null,
      job_title: jobTitle || null,
      industry: industry || null,
      email_length: emailLength || null,
      specific_context: specificContext || null,
    })

    if (dbError) {
      console.error("Supabase insert error:", dbError)
      return NextResponse.json({ error: "Failed to save email" }, { status: 500 })
    }

    return NextResponse.json({ subjectLine, emailBody })

  } catch (err) {
    console.error("Groq error:", err)
    return NextResponse.json({ error: "Failed to generate email" }, { status: 500 })
  }
}