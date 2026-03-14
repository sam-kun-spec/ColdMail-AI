import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-server"

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from("emails")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Supabase fetch error:", error) // ← added
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 })
  }

  return NextResponse.json({ emails: data })
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await req.json()

  if (!id) {
    return NextResponse.json({ error: "Missing email id" }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from("emails")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    console.error("Supabase delete error:", error) // ← added
    return NextResponse.json({ error: "Failed to delete email" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}