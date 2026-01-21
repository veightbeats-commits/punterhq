"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Share, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
  const postUrl = `${window.location.origin}/posts/${article.id}`

  if (navigator.share) {
    try {
      await navigator.share({
        title: article.title,
        text: text,
        url: postUrl,
      })
    } catch (err) {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, "_blank")
    }
  } else {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, "_blank")
  }
}

function getSafeImageUrl(raw: string | null): string {
  if (!raw) {
    console.log("No image URL provided, using placeholder")
    return "https://placehold.co/600x400"
  }
  const trimmed = raw.trim()
  if (!trimmed) {
    console.log("Empty image URL provided, using placeholder")
    return "https://placehold.co/600x400"
  }

  // Allow root-relative paths (served by our own Next.js app)
  if (trimmed.startsWith("/")) {
    console.log("Using root-relative path:", trimmed)
    return trimmed
  }

  try {
    const url = new URL(trimmed)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : undefined
    
    // Expanded list of allowed image hosts for security
    const allowedHosts = new Set([
      "placehold.co",
      "images.unsplash.com",
      "i.imgur.com",
      "cdn.pixabay.com",
      "images.pexels.com",
      "media.gettyimages.com",
      "thumbs.dreamstime.com",
      ...(supabaseHostname ? [supabaseHostname] : []),
    ])
    
    if (
      (url.protocol === "http:" || url.protocol === "https:") &&
      allowedHosts.has(url.hostname)
    ) {
      console.log("Using allowed image URL:", trimmed)
      return url.toString()
    }
    
    console.log("URL not in allowed hosts, using placeholder. Host:", url.hostname, "URL:", trimmed)
    return "https://placehold.co/600x400?text=Blocked+URL"
  } catch (error) {
    console.log("Invalid URL format, using placeholder for:", trimmed, "Error:", error)
    return "https://placehold.co/600x400?text=Invalid+URL"
  }
}

export function PostCard({ article }: PostCardProps) {
  return (
    <Link href={`/posts/${article.id}`}>
      <Card className="group border border-border bg-card/60 backdrop-blur-sm hover:border-primary/80 transition-all duration-300 shine-effect overflow-visible cursor-pointer">
        <div className="relative h-48 overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover:opacity-0 transition-opacity z-10" />
          <Image
            src={getSafeImageUrl(article.image)}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
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
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                sharePost(article)
              }}
              className="p-2 hover:bg-primary/10 cursor-pointer rounded flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
            >
              <Share className="w-4 h-4" />
              Share
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}