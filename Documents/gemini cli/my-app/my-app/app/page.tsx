import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, ChevronRight, Activity, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { StatusRow } from "@/components/status-row"
import { PostCard } from "@/components/post-card"
import { createClient } from "@/lib/supabase-server"

export const revalidate = 60

interface Post {
  id: number
  title: string
  description: string
  category: string
  date: string
  image: string | null
  source: string
}

interface StatusCardItem {
  id: string
  name: string
  image_url: string
  betway_link: string
  social_link?: string | null
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : undefined
const ALLOWED_IMAGE_HOSTS = new Set([
  "placehold.co",
  ...(supabaseHostname ? [supabaseHostname] : []),
])

function getSafeImageUrl(raw: string | null): string {
  if (!raw) return "https://placehold.co/600x400"
  const trimmed = raw.trim()
  if (!trimmed) return "https://placehold.co/600x400"

  // Allow root-relative paths (served by our own Next.js app)
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

export default async function HomePage() {
  const supabase = await createClient()

  const [postsResult, statusCardsResult] = await Promise.all([
    supabase.from("posts").select("*").order("created_at", { ascending: false }),
    supabase
      .from("status_cards")
      .select("id, name, image_url, betway_link, social_link")
      .order("created_at", { ascending: false }),
  ])

  const { data: posts, error: postsError } = postsResult
  const { data: statusCards, error: statusCardsError } = statusCardsResult

  if (postsError) {
    console.error("Error fetching posts on home page:", postsError)
    throw new Error("Failed to load posts")
  }

  if (statusCardsError) {
    console.error("Error fetching status cards on home page:", statusCardsError)
    throw new Error("Failed to load status cards")
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 space-y-12 mb-24">

        {/* Status Cards - Top Feature */}
        <section>
          <StatusRow cards={statusCards} />
        </section>

        {/* Hero Section */}
        <section className="relative py-[1.2px] md:py-[2px] text-center space-y-6">
          <div className="inline-block relative">
            <h1 className="text-5xl md:text-7xl font-black font-mono tracking-tighter italic skewed mb-2 relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary animate-pulse">
              PUNTER <span className="text-primary">HQ</span>
            </h1>
            <div className="absolute -inset-1 bg-primary/20 blur-xl opacity-50 skew-x-[-10deg]"></div>
          </div>

          <p className="text-lg md:text-2xl text-muted-foreground font-light tracking-wide max-w-2xl mx-auto border-l-2 border-primary pl-4">
            THE ULTIMATE <span className="text-primary font-bold">STRATEGY</span> PLATFORM for SOCCER BETTING
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 border border-primary/30 bg-primary/5 skewed-edge">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-mono text-primary">LIVE DATA FEED</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border border-accent/30 bg-accent/5 skewed-edge">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-mono text-accent">AI PREDICTIONS</span>
            </div>
          </div>
        </section>

        {/* Featured News Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <h2 className="text-2xl md:text-3xl font-bold font-mono uppercase flex items-center gap-2">
              <span className="w-3 h-8 bg-primary skew-x-[-20deg]"></span>
              Latest Intel
            </h2>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-primary text-primary font-mono rounded-none px-4 py-1 animate-pulse">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                LIVE UPDATES
              </Badge>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((article) => (
              <PostCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-none blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <Card className="relative border border-primary/50 bg-[#050505] overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

            <CardHeader className="text-center relative z-10">
              <CardTitle className="text-3xl md:text-5xl font-black font-mono italic text-white uppercase tracking-tighter">
                Strategies <span className="text-primary">Deployed</span>
              </CardTitle>
              <CardDescription className="text-lg md:text-xl mt-4 max-w-2xl mx-auto text-gray-400">
                Access the <span className="text-primary">advanced betting calculator</span> and engineer your winning formula provided by Punter HQ.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex justify-center pb-12 relative z-10">
              <Link
                href="/strategy"
                className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black transition-all duration-200 bg-primary hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary skewed-edge group-hover:shadow-[0_0_20px_var(--primary)]"
              >
                <span className="mr-2">LAUNCH TERMINAL</span>
                <TrendingUp className="w-5 h-5" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Responsible Gambling Section */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold font-mono uppercase flex items-center justify-center gap-2">
              <span className="w-3 h-8 bg-red-500 skew-x-[-20deg]"></span>
              <span className="text-red-500">Responsible Gambling</span>
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              At Punter HQ, we are committed to promoting responsible gambling practices and ensuring a safe betting environment for all users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Policies */}
            <Card className="border-border/50 bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-mono uppercase flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Our Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Age Verification</h4>
                  <p className="text-sm text-muted-foreground">
                    Strict 18+ age verification required. No minors permitted on our platform.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Privacy Protection</h4>
                  <p className="text-sm text-muted-foreground">
                    Your data is encrypted and never shared with third parties without consent.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Fair Gaming</h4>
                  <p className="text-sm text-muted-foreground">
                    All predictions and strategies are provided transparently without guaranteed outcomes.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Terms & Conditions */}
            <Card className="border-border/50 bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-mono uppercase flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  Terms & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">No Guarantees</h4>
                  <p className="text-sm text-muted-foreground">
                    All betting strategies and predictions are for informational purposes only. Past performance does not guarantee future results.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">User Responsibility</h4>
                  <p className="text-sm text-muted-foreground">
                    Users are solely responsible for their betting decisions and financial consequences.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">Service Availability</h4>
                  <p className="text-sm text-muted-foreground">
                    We reserve the right to modify or terminate services without prior notice.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Responsible Gaming */}
            <Card className="border-border/50 bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-mono uppercase flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Get Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-500">Warning Signs</h4>
                  <p className="text-sm text-muted-foreground">
                    Chasing losses, betting more than you can afford, neglecting responsibilities.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-500">Self-Exclusion</h4>
                  <p className="text-sm text-muted-foreground">
                    Take breaks and set limits. Use self-exclusion tools when needed.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-500">Support Resources</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Gamblers Anonymous: 1-800-522-4700</p>
                    <p>• National Problem Gambling Helpline</p>
                    <p>• Seek professional help immediately</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Warning Banner */}
          <Card className="border-red-500/30 bg-red-950/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-red-500 font-bold">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="uppercase font-mono">Important Notice</span>
                </div>
                <p className="text-sm text-red-400 max-w-4xl mx-auto">
                  <strong>Gambling can be addictive.</strong> Please gamble responsibly. Only bet what you can afford to lose. 
                  If you or someone you know has a gambling problem, seek help immediately. 
                  Our platform is for entertainment purposes only and does not encourage irresponsible gambling behavior.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/privacy-policy" className="text-primary hover:underline underline-offset-2">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/terms-of-service" className="text-primary hover:underline underline-offset-2">
              Terms of Service
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/responsible-gambling" className="text-primary hover:underline underline-offset-2">
              Responsible Gambling
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/contact" className="text-primary hover:underline underline-offset-2">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
