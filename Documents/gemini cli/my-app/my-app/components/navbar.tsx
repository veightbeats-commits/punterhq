"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Target, Gift, Wrench, Activity, Brain, Grid3x3 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ContactForm } from "@/components/contact-form"

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "HOME", icon: Home },
    { href: "/strategy", label: "STRATEGY", icon: Target },
    { href: "/promotions", label: "PROMOS", icon: Gift },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-primary/50 shadow-[0_-5px_20px_-10px_var(--primary)]">
      <div className="max-w-7xl mx-auto">
<div className="grid grid-cols-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex flex-col items-center justify-center gap-1 py-2 sm:py-3 transition-all duration-300 overflow-hidden ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {/* Active Indicator Background */}
                <div className={`absolute inset-0 bg-primary/10 skew-x-[-10deg] transform transition-transform duration-300 ${isActive ? 'translate-y-0' : 'translate-y-full'}`} />

                {/* Top Border for Active */}
                <div className={`absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_10px_var(--primary)] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 relative z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? "drop-shadow-[0_0_5px_var(--primary)]" : ""}`} />
                <span className="text-[8px] sm:text-[10px] md:text-xs font-mono font-bold tracking-wider relative z-10">{item.label}</span>
              </Link>
            )
          })}
          <Dialog>
            <DialogTrigger asChild>
              <button
                className={`group relative flex flex-col items-center justify-center gap-1 py-2 sm:py-3 transition-all duration-300 overflow-hidden text-muted-foreground hover:text-foreground`}
              >
                <div className={`absolute inset-0 bg-primary/10 skew-x-[-10deg] transform transition-transform duration-300 translate-y-full group-hover:translate-y-0`} />
                <Wrench className={`h-5 w-5 sm:h-6 sm:w-6 relative z-10 transition-transform duration-300 group-hover:scale-110`} />
                <span className="text-[8px] sm:text-[10px] md:text-xs font-mono font-bold tracking-wider relative z-10">CONTACT</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Contact Us</DialogTitle>
                <DialogDescription>
                  Have a feedback? Fill out form below to get in touch.
                </DialogDescription>
              </DialogHeader>
              <ContactForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  )
}
