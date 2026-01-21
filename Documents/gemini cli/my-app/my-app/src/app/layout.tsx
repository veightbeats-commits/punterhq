import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Orbitron } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider"
import { createBaseMetadata } from "@/lib/metadata"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

export const metadata = createBaseMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${orbitron.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-foreground`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-1 pb-16 sm:pb-20 md:pb-24">{children}</main>
            <Navbar />
            <Analytics />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
