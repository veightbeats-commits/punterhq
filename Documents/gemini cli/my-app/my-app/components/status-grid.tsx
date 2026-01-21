import { StatusCard } from "./status-card"

interface StatusGridProps {
    cards: {
        id: string
        name: string
        image_url: string
        betway_link: string
        social_link?: string
    }[]
}

export function StatusGrid({ cards }: StatusGridProps) {
    if (!cards || cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="text-[#39FF14] text-xl font-mono animate-pulse">NO STATUS CARDS FOUND</div>
                <p className="text-gray-400 max-w-md">
                    No strategies have been deployed yet. Admin needs to add status cards.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
            {cards.map((card) => (
                <StatusCard
                    key={card.id}
                    id={card.id}
                    name={card.name}
                    imageUrl={card.image_url}
                    betwayLink={card.betway_link}
                    socialLink={card.social_link}
                />
            ))}
        </div>
    )
}
