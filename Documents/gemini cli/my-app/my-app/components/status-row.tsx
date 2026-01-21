"use client"

import { StatusCard } from "./status-card"

interface StatusRowProps {
    cards: {
        id: string
        name: string
        image_url: string
        betway_link: string
        social_link?: string
    }[]
}

export function StatusRow({ cards }: StatusRowProps) {
    if (!cards || cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-4 text-center space-y-2 border border-[#39FF14]/20 rounded-lg bg-black/50 backdrop-blur-sm mx-4">
                <div className="text-[#39FF14] text-sm font-mono animate-pulse">NO STATUS CARDS FOUND</div>
                <p className="text-gray-500 text-xs">
                    Admin: Add cards in /admin/status
                </p>
            </div>
        )
    }

    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 px-4 hide-scrollbar">
            <div className="flex gap-2 sm:gap-3 md:gap-4 min-w-max mx-auto justify-center">
                {cards.map((card) => (
                    <div key={card.id} className="w-[114px] sm:w-[180px] md:w-[212.8px] shrink-0">
                        <StatusCard
                            id={card.id}
                            name={card.name}
                            imageUrl={card.image_url}
                            betwayLink={card.betway_link}
                            socialLink={card.social_link}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
