"use client"

import { useState, useEffect } from "react"
import { Link as LinkIcon, Copy, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

import { toast } from "sonner"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { useSession } from "@/components/session-provider"
import { createClientComponentClient } from "@/lib/supabase"

interface StatusCardProps {
    id: string
    name: string
    imageUrl: string
    betwayLink: string
    socialLink?: string
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_HOSTNAME = SUPABASE_URL ? new URL(SUPABASE_URL).hostname : undefined
const ALLOWED_IMAGE_HOSTS = new Set([
    "placehold.co",
    ...(SUPABASE_HOSTNAME ? [SUPABASE_HOSTNAME] : []),
])

const getSafeImageUrl = (raw?: string): string => {
    if (!raw) return "https://placehold.co/600x400"
    const trimmed = raw.trim()
    if (!trimmed) return "https://placehold.co/600x400"

    if (trimmed.startsWith("/")) return trimmed
    try {
        const url = new URL(trimmed)
        if (
            (url.protocol === "http:" || url.protocol === "https:") &&
            ALLOWED_IMAGE_HOSTS.has(url.hostname)
        ) {
            return url.toString()
        }
        return "https://placehold.co/600x400"
    } catch {
        return "https://placehold.co/600x400"
    }
}

export function StatusCard({ id, name, imageUrl, betwayLink, socialLink }: StatusCardProps) {
    // Extract bookingCode from betwayLink
    const extractBookingCode = (url: string) => {
        try {
            if (!url) return "NO CODE"
            const urlObj = new URL(url)
            const bookingCodeParam = urlObj.searchParams.get("bookingCode")
            if (bookingCodeParam) return bookingCodeParam

            // Fallback for non-standard or older formats if necessary, though direct param is preferred
            const parts = url.split("bookingCode=")
            if (parts.length > 1) {
                return parts[parts.length - 1].split("&")[0] // Handle potential subsequent params
            }
            return "CODE NOT FOUND"
        } catch (e) {
            // If not a valid URL, try simple split for "bookingCode="
            const parts = url.split("bookingCode=")
            if (parts.length > 1) {
                return parts[parts.length - 1].split("&")[0]
            }
            return "INVALID LINK FORMAT"
        }
    }

    const bookingCode = extractBookingCode(betwayLink)
    const { session } = useSession()
const [isFavorited, setIsFavorited] = useState(false)
    const supabase = createClientComponentClient()

useEffect(() => {
        if (session) {
            checkFavorite()
        }
    }, [session, id])

    const checkFavorite = async () => {
        if (!session) return
        const { data } = await supabase
            .from('user_favorites')
            .select('id')
            .eq('user_id', session.user.id)
            .eq('status_card_id', id)
        setIsFavorited(!!data?.length)
    }

    const toggleFavorite = async () => {
        if (!session) {
            toast.error("Please log in to favorite strategies")
            return
        }
        if (isFavorited) {
            await supabase
                .from('user_favorites')
                .delete()
                .eq('user_id', session.user.id)
                .eq('status_card_id', id)
            toast.success("Removed from favorites")
        } else {
            await supabase
                .from('user_favorites')
                .insert({ user_id: session.user.id, status_card_id: id })
            toast.success("Added to favorites")
        }
        setIsFavorited(!isFavorited)
    }



    const copyToClipboard = () => {
        navigator.clipboard.writeText(bookingCode)
        toast.success("Booking Code copied to clipboard!")
    }



    return (
        <>
        <Card
            className="group border border-border bg-card/60 backdrop-blur-sm hover:border-primary/80 transition-all duration-300 shine-effect overflow-visible"
        >
            <div className="relative h-[60px] sm:h-[90px] md:h-[129px] overflow-hidden border-b border-border/50">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover:opacity-0 transition-opacity z-10" />
<Image
                    src={getSafeImageUrl(imageUrl)}
                    alt={name}
                    fill
                    sizes="200px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                />
            </div>

            <CardContent className="relative">
                {session && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleFavorite}
                        className="absolute top-0 right-0 p-1"
                    >
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </Button>
                )}
                <CardTitle className="text-[16px] sm:text-[25px] md:text-[35.7px] font-bold font-mono tracking-tight leading-tight text-center mt-[-5px] sm:mt-[-10px] md:mt-[-15px] group-hover:text-primary transition-colors">
                    {name}
                </CardTitle>

                <Link href={betwayLink} target="_blank" className="w-full mt-[10.64px]">
                    <div
                        className="flex items-center justify-center gap-2 px-[5px] sm:px-[10px] md:px-[15.2px] py-[1px] sm:py-[1.3px] md:py-[1.6px] border border-primary/30 bg-primary/5 skewed-edge cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={copyToClipboard} // This will still copy the code, but the div also acts as a link
                        title="Click to view bet and copy booking code"
                    >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                        <span className="text-xs sm:text-sm font-mono text-primary font-black uppercase tracking-wider">{bookingCode}</span>
                    </div>
                </Link>

                {socialLink && (
                    <div className="w-full mt-[5px] sm:mt-[8px] md:mt-[10.64px]">
                        <Link href={socialLink} target="_blank" className="w-full">
                            <div className="w-full border border-[#1877F2]/30 bg-[#1877F2]/5 px-[5px] sm:px-[10px] md:px-[15.2px] py-[1px] sm:py-[1.3px] md:py-[1.6px] skewed-edge text-[#1877F2] font-mono text-[8px] sm:text-[10px] md:text-[10.5px] uppercase tracking-widest flex items-center justify-center gap-2">
                                SOCIAL PROFILE
                            </div>
                        </Link>
                    </div>
                )}


            </CardContent>
        </Card>


        </>
    )
}
