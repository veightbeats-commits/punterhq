import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'
import { createPostMetadata } from '@/lib/metadata'

interface Post {
  id: number
  title: string
  description: string
  category: string
  date: string
  image: string | null
  source: string
}

async function getPost(id: string): Promise<Post | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/posts/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

function getSafeImageUrl(raw: string | null): string {
  if (!raw) {
    return "https://placehold.co/1200x630?text=Punter+HQ"
  }
  const trimmed = raw.trim()
  if (!trimmed) {
    return "https://placehold.co/1200x630?text=Punter+HQ"
  }

  // Allow root-relative paths (served by our own Next.js app)
  if (trimmed.startsWith("/")) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    return `${siteUrl}${trimmed}`
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
      return url.toString()
    }
    
    return "https://placehold.co/1200x630?text=Punter+HQ"
  } catch (error) {
    return "https://placehold.co/1200x630?text=Punter+HQ"
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.id)
  
  if (!post) {
    return {
      title: 'Post Not Found | Punter HQ',
      description: 'The requested post could not be found.',
    }
  }

  return createPostMetadata(post)
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.id)

  if (!post) {
    notFound()
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/posts/${post.id}`
  const shareText = `Check out this post: ${post.title}\n\n${post.description}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
      }
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8 px-2 sm:px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {/* Post Content */}
        <Card className="border-2 border-border">
          {/* Image Section */}
          <div className="relative h-64 sm:h-96 overflow-hidden rounded-t-lg">
            <Image
              src={getSafeImageUrl(post.image)}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              priority
            />
            <div className="absolute top-0 right-0 bg-primary text-black font-bold font-mono text-xs px-3 py-1 skewed-edge z-20">
              {post.category}
            </div>
          </div>

          {/* Post Details */}
          <CardHeader className="pb-4 space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-primary" /> 
                {post.date}
              </span>
              <span className="text-accent">{post.source}</span>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-2xl sm:text-3xl font-bold font-mono tracking-tight leading-tight group-hover:text-primary transition-colors">
                {post.title}
              </CardTitle>
              <Badge variant="secondary" className="w-fit">
                {post.category}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <CardDescription className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {post.description}
            </CardDescription>
            
            {/* Share Section */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-semibold mb-4">Share this post</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")}
                  className="px-4 py-2 bg-[#1877f2] text-white rounded-md hover:bg-[#166fe5] transition-colors"
                >
                  Share on Facebook
                </button>
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${post.title} ${shareUrl}`)}`, "_blank")}
                  className="px-4 py-2 bg-[#1da1f2] text-white rounded-md hover:bg-[#1a91da] transition-colors"
                >
                  Share on X
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, "_blank")}
                  className="px-4 py-2 bg-[#25d366] text-white rounded-md hover:bg-[#128c7e] transition-colors"
                >
                  Share on WhatsApp
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}