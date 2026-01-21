import { StatusForm } from "@/components/status-form"
import { StatusAdminList } from "@/components/status-admin-list"
import { createClient } from "@/lib/supabase-server"

export default async function AdminStatusPage() {
    const supabase = await createClient()
    const { data: cards, error } = await supabase
        .from("status_cards")
        .select("id, name, image_url, betway_link, social_link, created_at")
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching status cards for admin:", error)
    }

    return (
        <div className="container mx-auto py-10 px-4 space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-8 text-center font-mono uppercase">Status Cards Management</h1>
                <StatusForm />
            </div>
            <div>
                <StatusAdminList cards={cards ?? []} />
            </div>
        </div>
    )
}
