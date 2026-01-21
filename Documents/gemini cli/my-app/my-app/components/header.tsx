"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Sun, Moon, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@/lib/supabase"
import { Button } from "./ui/button"
import { useSession } from "./session-provider"
import { toast } from "sonner"

export function Header() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { session } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (session) {
      const channel = supabase
        .channel('status_cards_changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'status_cards' }, (payload: any) => {
          toast('New betting strategy available!', { description: payload.new.name })
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [session])

  useEffect(() => {
    // Force re-render when auth state changes to ensure UI is in sync
    if (session !== undefined) {
      router.refresh()
    }
  }, [session, router])

  const handleLogout = async () => {
    console.log('Logout button clicked, handleLogout function called.');
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-primary/50 shadow-[0_0_15px_-5px_var(--primary)]">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5">
        <div className="flex justify-between items-center">
          <Link href="/" className="group">
            <h1 className="text-2xl sm:text-4xl font-black font-mono tracking-tighter italic text-foreground group-hover:text-primary transition-colors duration-300 relative inline-block">
              <span className="relative z-10">PUNTER HQ</span>
              <span className="absolute inset-0 text-primary blur-sm opacity-50 group-hover:opacity-100 transition-opacity">PUNTER HQ</span>
            </h1>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative p-2 rounded-full border border-primary/50 hover:border-primary bg-primary/10 hover:bg-primary/20 transition-all duration-300 group skewed-edge"
              aria-label="Toggle Theme"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="h-5 w-5 text-primary group-hover:animate-spin-slow transition-transform" />
                ) : (
                  <Moon className="h-5 w-5 text-primary group-hover:animate-pulse" />
                )
              ) : (
                <div className="h-5 w-5 bg-primary/20 rounded-full animate-pulse" />
              )}
            </button>
            {session ? (
              <div className="flex gap-2 sm:gap-4">
                <Button variant="outline" size="sm" onClick={() => router.push('/profile')}>
                  <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
                <Button size="sm" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <div className="flex gap-2 sm:gap-4">
                <Button size="sm" onClick={() => router.push('/login')}>Login</Button>
                <Button size="sm" onClick={() => router.push('/signup')}>Sign Up</Button>
              </div>
            )}

            <div className="h-2 w-12 bg-primary skew-x-[-20deg] animate-pulse hidden sm:block"></div>
          </div>
        </div>
      </div>
    </header>
  )
}
