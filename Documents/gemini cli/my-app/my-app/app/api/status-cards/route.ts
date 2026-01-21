import { createClient } from '@/lib/supabase-server'
import { NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase-server"

export const revalidate = 60

export async function GET() {
  try {
    const supabase = createStaticClient()

    const { data, error } = await supabase
      .from("status_cards")
      .select("id, name, image_url, betway_link, social_link")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching status cards:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error("Unexpected error in /api/status-cards:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
