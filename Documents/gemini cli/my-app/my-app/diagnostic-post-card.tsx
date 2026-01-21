"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Share, ChevronRight } from "lucide-react"
import Image from "next/image"

interface Post {
  id: number
  title: string
  description: string
  category: string
  date: string
  image: string | null
  source: string
}

interface PostCardProps {
  article: Post
}

const sharePost = async (article: Post) => {
  const text = `Check out this post: ${article.title}\n\n${article.description}`
  const url = window.location.href

  if (navigator.share) {
    try {
      await navigator.share({
        title: article.title,
        text: text,
        url: url,
      })
    } catch (err) {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
    }
  } else {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
  }
}

function getSafeImageUrl(raw: string | null): string {
  console.log("Original image URL:", raw)
  
  if (!raw) {
    console.log("Image URL is null/undefined, using placeholder")
    return "https://placehold.co/600x400"
  }
  
  const trimmed = raw.trim()
  if (!trimmed) {
    console.log("Image URL is empty after trim, using placeholder")
    return "https://placehold.co/600x400"
  }

  // Allow root-relative paths (served by our own Next.js app)
  if (trimmed.startsWith("/")) {
    console.log("Image URL is root-relative, using as-is:", trimmed)
    return trimmed
  }

  try {
    const url = new URL(trimmed)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    console.log("Supabase URL from env:", supabaseUrl)
    const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : undefined
    console.log("Supabase hostname:", supabaseHostname)
    
    const allowedHosts = new Set([
      "placehold.co",
      ...(supabaseHostname ? [supabaseHostname] : []),
    ])
    
    console.log("URL hostname:", url.hostname)
    console.log("Allowed hosts:", Array.from(allowedHosts))
    
    if (
      (url.protocol === "http:" || url.protocol === "https:") &&
      allowedHosts.has(url.hostname)
    ) {
      console.log("Image URL passed validation, using:", url.toString())
      return url.toString()
    }
    
    console.log("Image URL failed validation, using placeholder")
    return "https://placehold.co/600x400"
  } catch (error) {
    console.error("Error parsing image URL:", error)
    return "https://placehold.co/600x400"
  }
}

export function DiagnosticPostCard({ article }: PostCardProps) {
  const imageUrl = getSafeImageUrl(article.image)
  
  return (
    <Card className="group border border-border bg-card/60 backdrop-blur-sm hover:border-primary/80 transition-all duration-300 shine-effect overflow-visible">
      {/* Debug info */}
      <div className="p-2 bg-red-500/10 text-xs font-mono">
        <div>Original: {article.image || 'null'}</div>
        <div>Processed: {imageUrl}</div>
        <div>ID: {article.id}</div>
      </div>
      
      <div className="relative h-48 overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover:opacity-0 transition-opacity z-10" />
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          onError={(e) => {
            console.error("Image failed to load:", imageUrl)
            const target = e.target as HTMLImageElement
            target.src = "https://placehold.co/600x400?text=Load+Error"
          }}
        />
        <div className="absolute top-0 right-0 bg-primary text-black font-bold font-mono text-xs px-3 py-1 skewed-edge z-20">
          {article.category}
        </div>
      </div>

      <CardHeader className="pb-2 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" /> {article.date}</span>
          <span className="text-accent">{article.source}</span>
        </div>
        <CardTitle className="text-lg font-bold font-mono tracking-tight leading-tight group-hover:text-primary transition-colors">
          {article.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 border-l-2 border-primary/20 pl-3">
          {article.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <div
            onClick={() => sharePost(article)}
            className="p-2 hover:bg-primary/10 cursor-pointer rounded flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <Share className="w-4 h-4" />
            Share
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all cursor-pointer" />
        </div>
      </CardContent>
    </Card>
  )
}
