import { createClient } from "@/lib/supabase-server"
import { StatusGrid } from "@/components/status-grid"

export const revalidate = 0 // Ensure fresh data on every visit

export default async function StatusPage() {
    const supabase = await createClient()
    const { data: cards, error } = await supabase
        .from("status_cards")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching status cards:", error)
        return <div className="text-center py-20 text-red-500">Failed to load cards.</div>
    }

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#39FF14]/10 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10" style={{ margin: '0', padding: '0' }}>
                <div className="text-center space-y-4" style={{ margin: '0', padding: '0' }}>
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter skewed-edge inline-block px-8 py-2 border-2 border-[#39FF14] text-white">
                        PUNTER <span className="text-[#39FF14]">HQ</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm md:text-base border-l-2 border-[#39FF14] pl-4">
                        THE ULTIMATE <span className="text-[#39FF14] font-bold">STRATEGY</span> PLATFORM FOR SOCCER BETTING
                    </p>
                </div>

                <div style={{ height: '24px' }} />
                <StatusGrid cards={cards || []} />

                <div className="flex justify-center gap-4 mt-20">
                    <div className="border border-[#39FF14]/30 bg-[#39FF14]/5 px-6 py-2 skewed-edge text-[#39FF14] font-mono text-sm animate-pulse">
                        LIVE DATA FEED
                    </div>
                    <div className="border border-[#8B5CF6]/30 bg-[#8B5CF6]/5 px-6 py-2 skewed-edge text-[#8B5CF6] font-mono text-sm">
                        AI PREDICTIONS
                    </div>
                </div>
            </div>
        </div>
    )
}
