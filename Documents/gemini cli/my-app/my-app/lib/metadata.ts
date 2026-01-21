import type { Metadata } from 'next'

interface Post {
  id: number
  title: string
  description: string
  category: string
  date: string
  image: string | null
  source: string
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
    return `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${trimmed}`
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

export function createPostMetadata(post: Post): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const postUrl = `${siteUrl}/posts/${post.id}`
  const imageUrl = getSafeImageUrl(post.image)

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: postUrl,
      siteName: 'Punter HQ',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
  }
}

export function createBaseMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    title: {
      default: 'Punter HQ - Betting Strategy & Tips',
      template: '%s | Punter HQ'
    },
    description: 'Professional betting strategies, tips, and calculators to help you make informed decisions. Calculate your betting strategy and maximize your winnings.',
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: 'Punter HQ - Betting Strategy & Tips',
      description: 'Professional betting strategies, tips, and calculators to help you make informed decisions.',
      type: 'website',
      url: siteUrl,
      siteName: 'Punter HQ',
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Punter HQ - Betting Strategy Platform',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Punter HQ - Betting Strategy & Tips',
      description: 'Professional betting strategies, tips, and calculators to help you make informed decisions.',
      images: [`${siteUrl}/og-image.png`],
    },
  }
}

export function createStrategyMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const strategyUrl = `${siteUrl}/strategy`

  return {
    title: 'Strategy Calculator - Punter HQ',
    description: 'Calculate and optimize your betting strategy with our advanced calculator. Track your progression and maximize your winnings.',
    alternates: {
      canonical: strategyUrl,
    },
    openGraph: {
      title: 'Strategy Calculator - Punter HQ',
      description: 'Calculate and optimize your betting strategy with our advanced calculator. Track your progression and maximize your winnings.',
      type: 'website',
      url: strategyUrl,
      siteName: 'Punter HQ',
      images: [
        {
          url: `${siteUrl}/og-strategy.png`,
          width: 1200,
          height: 630,
          alt: 'Betting Strategy Calculator - Punter HQ',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Strategy Calculator - Punter HQ',
      description: 'Calculate and optimize your betting strategy with our advanced calculator.',
      images: [`${siteUrl}/og-strategy.png`],
    },
  }
}