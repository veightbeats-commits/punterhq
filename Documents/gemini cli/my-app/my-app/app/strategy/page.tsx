"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Sun, Moon, LayoutGrid, TableIcon, Share2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useSession } from "@/components/session-provider"

interface DayData {
  day: number
  wager: number
  odds: number
  winnings: number
  isWin: boolean
}

export default function StrategyCalculator() {
  const [startingWager, setStartingWager] = useState<number>(100)
  const [defaultOdds, setDefaultOdds] = useState<number>(1.5)
  const [usePercentage, setUsePercentage] = useState<boolean>(false)
  const [numberOfDays, setNumberOfDays] = useState<number>(10)
  const [tableData, setTableData] = useState<DayData[]>([])
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table")
  const [downloadsUsed, setDownloadsUsed] = useState<number>(0)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter()
  const { session } = useSession()
  /* Local theme state removed to support global theme persistence */

  useEffect(() => {
    generateTableData()
  }, [startingWager, defaultOdds, numberOfDays])

  useEffect(() => {
    const stored = localStorage.getItem('strategyDownloads')
    setDownloadsUsed(stored ? parseInt(stored, 10) : 0)
  }, [])

  useEffect(() => {
    if (session?.user) {
      // Reset downloads for authenticated users
      localStorage.setItem('strategyDownloads', '0')
      setDownloadsUsed(0)
    }
  }, [session])

  const generateTableData = () => {
    const data: DayData[] = []
    let currentWager = startingWager

    for (let i = 1; i <= numberOfDays; i++) {
      const winnings = currentWager * defaultOdds
      data.push({
        day: i,
        wager: currentWager,
        odds: defaultOdds,
        winnings: winnings,
        isWin: true,
      })
      currentWager = winnings
    }

    setTableData(data)
  }

  const updateWager = (day: number, newWager: number) => {
    const updatedData = [...tableData]
    const index = day - 1

    for (let i = index; i < updatedData.length; i++) {
      if (i === index) {
        updatedData[i].wager = newWager
      } else {
        updatedData[i].wager = updatedData[i - 1].winnings
      }
      updatedData[i].winnings = updatedData[i].wager * updatedData[i].odds
    }

    setTableData(updatedData)
  }

  const updateOdds = (day: number, newOdds: number) => {
    const updatedData = [...tableData]
    const index = day - 1

    updatedData[index].odds = newOdds
    updatedData[index].winnings = updatedData[index].wager * newOdds

    for (let i = index + 1; i < updatedData.length; i++) {
      updatedData[i].wager = updatedData[i - 1].winnings
      updatedData[i].winnings = updatedData[i].wager * updatedData[i].odds
    }

    setTableData(updatedData)
  }

  const toggleWinLoss = (day: number) => {
    const updatedData = [...tableData]
    const index = day - 1
    updatedData[index].isWin = !updatedData[index].isWin
    setTableData(updatedData)
  }

  const calculateRunningTotal = (dayIndex: number): number => {
    let total = startingWager
    for (let i = 0; i <= dayIndex; i++) {
      if (tableData[i].isWin) {
        total += tableData[i].winnings - tableData[i].wager
      } else {
        total -= tableData[i].wager
      }
    }
    return total
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatOdds = (odds: number): string => {
    if (usePercentage) {
      return `${((odds - 1) * 100).toFixed(0)}%`
    }
    return odds.toFixed(2)
  }

  const parseOddsInput = (input: string): number => {
    if (usePercentage) {
      const percentage = Number.parseFloat(input.replace("%", ""))
      return 1 + percentage / 100
    }
    return Number.parseFloat(input)
  }

  const { theme } = useTheme()
  const finalTotal = tableData.length > 0 ? calculateRunningTotal(tableData.length - 1) : startingWager
  const totalProfit = finalTotal - startingWager
  const profitPercentage = ((totalProfit / startingWager) * 100).toFixed(2)

  const generateStrategyCard = async (theme: string | undefined): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!

      const lightColors = {
        bg: "#ffffff",
        surface: "#f1f5f9",
        primary: "#7c3aed",
        accent: "#00ff9d",
        text: "#030712",
        textMuted: "#475569",
        success: "#16a34a",
        error: "#dc2626",
        border: "#e2e8f0"
      };

      const darkColors = {
        bg: "#030712",
        surface: "#111827",
        primary: "#00ff9d",
        accent: "#7c3aed",
        text: "#f8fafc",
        textMuted: "#94a3b8",
        success: "#22c55e",
        error: "#ef4444",
        border: "#1e293b"
      };

      const colors = theme === 'light' ? lightColors : darkColors;

      const includeCalendar = numberOfDays <= 10
      const headerHeight = 160
      const tableHeaderHeight = 70
      const tableRowHeight = 45
      const tableRows = numberOfDays
      const footerHeight = 100

      let canvasHeight = headerHeight + tableHeaderHeight + tableRows * tableRowHeight

      if (includeCalendar) {
        const calendarHeaderHeight = 80
        const cardHeight = 220
        const gap = 40
        const cardsPerRow = 3
        const totalRows = Math.ceil(numberOfDays / cardsPerRow)
        const calendarTotalHeight = calendarHeaderHeight + 80 + totalRows * (cardHeight + gap)
        canvasHeight += calendarTotalHeight + footerHeight + 40
      } else {
        canvasHeight += footerHeight
      }

      canvas.width = 1200
      canvas.height = canvasHeight

      // Background
      ctx.fillStyle = colors.bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Grid Pattern Overlay (Subtle)
      ctx.strokeStyle = colors.border
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 0; i < canvas.width; i += 40) { ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); }
      for (let i = 0; i < canvas.height; i += 40) { ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); }
      ctx.globalAlpha = 0.1
      ctx.stroke()
      ctx.globalAlpha = 1.0

      // --- Header Section ---
      // Skewed Header Graphic
      ctx.fillStyle = colors.primary
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(canvas.width, 0)
      ctx.lineTo(canvas.width, headerHeight - 40)
      ctx.lineTo(0, headerHeight)
      ctx.fill()

      // Dark overlay on header for contrast
      ctx.fillStyle = colors.bg
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(canvas.width, 0)
      ctx.lineTo(canvas.width, headerHeight - 45)
      ctx.lineTo(0, headerHeight - 5)
      ctx.fill()

      // Title
      ctx.fillStyle = colors.primary
      ctx.font = "900 70px Orbitron, monospace" // Fallback to monospace if Orbitron fails
      ctx.textAlign = "center"
      ctx.shadowColor = colors.primary
      ctx.shadowBlur = 20
      ctx.fillText("PUNTER HQ", canvas.width / 2, 80)
      ctx.shadowBlur = 0 // Reset shadow

      ctx.fillStyle = colors.text
      ctx.font = "bold 24px Space Grotesk, sans-serif"
      ctx.letterSpacing = "4px"
      ctx.fillText("STRATEGY BLUEPRINT // DECIPHERED", canvas.width / 2, 120)

      let currentY = headerHeight + 20

      // --- Table Section ---
      const tableWidth = 1100
      const tableX = (canvas.width - tableWidth) / 2
      const rowHeight = 45
      const headerRowHeight = 60

      const colWidths = [100, 240, 120, 240, 100, 300]

      // Table Header Frame
      ctx.strokeStyle = colors.primary
      ctx.lineWidth = 2
      ctx.strokeRect(tableX, currentY, tableWidth, headerRowHeight)

      ctx.fillStyle = theme === 'light' ? "rgba(124, 58, 237, 0.1)" : "rgba(0, 255, 157, 0.1)"
      ctx.fillRect(tableX, currentY, tableWidth, headerRowHeight)

      ctx.fillStyle = colors.primary
      ctx.font = "bold 20px Orbitron, monospace"
      ctx.textAlign = "center"

      const headers = ["DAY", "WAGER", "ODDS", "WINNINGS", "STATUS", "TOTAL BALANCE"]
      let xPos = tableX
      headers.forEach((header, i) => {
        ctx.fillText(header, xPos + colWidths[i] / 2, currentY + 38)
        xPos += colWidths[i]
      })

      currentY += headerRowHeight

      ctx.font = "18px Space Grotesk, sans-serif"
      ctx.textAlign = "center"

      tableData.forEach((row, index) => {
        // Alternating rows
        if (index % 2 === 0) {
          ctx.fillStyle = colors.surface
          ctx.fillRect(tableX, currentY, tableWidth, rowHeight)
        }

        // Row Border Bottom
        ctx.strokeStyle = colors.border
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(tableX, currentY + rowHeight)
        ctx.lineTo(tableX + tableWidth, currentY + rowHeight)
        ctx.stroke()

        // Text Color
        ctx.fillStyle = colors.text

        let xPos = tableX

        // Day
        ctx.fillStyle = colors.primary
        ctx.font = "bold 18px Orbitron, monospace"
        ctx.fillText(row.day.toString(), xPos + colWidths[0] / 2, currentY + 28)
        ctx.font = "18px Space Grotesk, sans-serif" // Reset font
        xPos += colWidths[0]

        // Wager
        ctx.fillStyle = colors.text
        ctx.fillText(`R ${row.wager.toFixed(2)}`, xPos + colWidths[1] / 2, currentY + 28)
        xPos += colWidths[1]

        // Odds
        ctx.fillStyle = colors.accent
        ctx.fillText(row.odds.toFixed(2), xPos + colWidths[2] / 2, currentY + 28)
        xPos += colWidths[2]

        // Winnings
        ctx.fillStyle = row.isWin ? colors.success : colors.error
        ctx.fillText(`R ${row.winnings.toFixed(2)}`, xPos + colWidths[3] / 2, currentY + 28)
        xPos += colWidths[3]

        // Status checkbox
        ctx.fillStyle = row.isWin ? colors.success : colors.textMuted
        ctx.fillText(row.isWin ? "VERIFIED" : "FAILED", xPos + colWidths[4] / 2, currentY + 28)
        xPos += colWidths[4]

        // Running Total
        const runningTotal = calculateRunningTotal(index)
        ctx.fillStyle = runningTotal >= startingWager ? colors.success : colors.error
        ctx.font = "bold 18px Orbitron, monospace"
        ctx.fillText(`R ${runningTotal.toFixed(2)}`, xPos + colWidths[5] / 2, currentY + 28)
        ctx.font = "18px Space Grotesk, sans-serif"

        currentY += rowHeight
      })

      // Bottom thick border for table
      ctx.strokeStyle = colors.primary
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(tableX, currentY)
      ctx.lineTo(tableX + tableWidth, currentY)
      ctx.stroke()

      if (includeCalendar) {
        currentY += 60

        // Calendar Header Section
        ctx.fillStyle = colors.primary
        ctx.font = "bold 40px Orbitron, monospace"
        ctx.textAlign = "center"
        ctx.shadowColor = colors.primary
        ctx.shadowBlur = 10
        ctx.fillText("TACTICAL TIMELINE", canvas.width / 2, currentY + 40)
        ctx.shadowBlur = 0

        currentY += 80

        const cardWidth = 340
        const cardHeight = 220
        const gap = 40
        const cardsPerRow = 3
        const startX = (canvas.width - (cardsPerRow * cardWidth + (cardsPerRow - 1) * gap)) / 2

        tableData.forEach((row, index) => {
          const col = index % cardsPerRow
          const rowNum = Math.floor(index / cardsPerRow)
          const x = startX + col * (cardWidth + gap)
          const y = currentY + rowNum * (cardHeight + gap)

          const statusColor = row.isWin ? colors.success : colors.error

          // Card Glow
          ctx.shadowColor = statusColor
          ctx.shadowBlur = 15
          ctx.strokeStyle = statusColor
          ctx.lineWidth = 2
          ctx.strokeRect(x, y, cardWidth, cardHeight)
          ctx.shadowBlur = 0 // Reset

          // Card Background
          ctx.fillStyle = theme === 'light' ? "rgba(241, 245, 249, 0.9)" : "rgba(17, 24, 39, 0.9)"
          ctx.fillRect(x, y, cardWidth, cardHeight)

          // Date Header
          ctx.fillStyle = statusColor
          ctx.fillRect(x, y, cardWidth, 40)

          ctx.fillStyle = theme === 'light' ? "#FFFFFF" : "#000"
          ctx.font = "bold 22px Orbitron, monospace"
          ctx.textAlign = "left"
          ctx.fillText(`DAY ${row.day}`, x + 15, y + 28)

          // Icon
          ctx.textAlign = "right"
          ctx.fillText(row.isWin ? "WIN" : "LOSS", x + cardWidth - 15, y + 28)

          // Content
          ctx.textAlign = "left"
          ctx.font = "18px Space Grotesk, sans-serif"
          ctx.fillStyle = colors.textMuted

          ctx.fillText(`Wager:`, x + 20, y + 80)
          ctx.fillStyle = colors.text
          ctx.fillText(`R ${row.wager.toFixed(2)}`, x + 120, y + 80)

          ctx.fillStyle = colors.textMuted
          ctx.fillText(`Odds:`, x + 20, y + 110)
          ctx.fillStyle = colors.accent
          ctx.fillText(`${row.odds.toFixed(2)}`, x + 120, y + 110)

          ctx.fillStyle = colors.textMuted
          ctx.fillText(`Net:`, x + 20, y + 140)
          ctx.fillStyle = statusColor
          ctx.fillText(`R ${row.winnings.toFixed(2)}`, x + 120, y + 140)

          // Total Line
          ctx.beginPath()
          ctx.moveTo(x + 20, y + 160)
          ctx.lineTo(x + cardWidth - 20, y + 160)
          ctx.strokeStyle = colors.border
          ctx.stroke()

          const runningTotal = calculateRunningTotal(index)
          ctx.fillStyle = colors.text
          ctx.font = "bold 20px Orbitron, monospace"
          ctx.fillText(`BAL: R ${runningTotal.toFixed(2)}`, x + 20, y + 195)
        })

        const totalRows = Math.ceil(numberOfDays / cardsPerRow)
        currentY += totalRows * (cardHeight + gap) + 60
      }

      // --- Footer ---
      ctx.fillStyle = colors.surface
      ctx.fillRect(0, currentY, canvas.width, 140)

      // Top Border of Footer
      ctx.strokeStyle = colors.primary
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(0, currentY)
      ctx.lineTo(canvas.width, currentY)
      ctx.stroke()

      const finalY = currentY + 70

      ctx.fillStyle = colors.success
      ctx.font = "bold 50px Orbitron, monospace"
      ctx.textAlign = "center"
      ctx.shadowColor = colors.success
      ctx.shadowBlur = 25
      ctx.fillText(`FINAL TOTAL: ${formatCurrency(finalTotal)}`, canvas.width / 2, finalY + 15)
      ctx.shadowBlur = 0

      // Generated By
      ctx.font = "16px Space Grotesk, sans-serif"
      ctx.fillStyle = colors.textMuted
      ctx.fillText("GENERATED BY PUNTER HQ TERMINAL", canvas.width / 2, finalY + 50)

      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
      }, "image/png")
    })
  }

  const downloadImage = async () => {
    if (!session?.user && downloadsUsed >= 3) {
      router.push('/signup?message=Sign up for unlimited strategy downloads')
      return
    }

    const blob = await generateStrategyCard(theme)
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "punter-hq-strategy.png"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    const newCount = downloadsUsed + 1
    setDownloadsUsed(newCount)
    localStorage.setItem('strategyDownloads', newCount.toString())
  }

  const uploadToImgur = async (blob: Blob): Promise<string> => {
    const formData = new FormData()
    formData.append('image', blob)
    const clientId = process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID || 'your-imgur-client-id' // Replace with your Imgur Client-ID
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      body: formData,
    })
    const data = await response.json()
    if (data.success) {
      return data.data.link
    } else {
      throw new Error('Failed to upload to Imgur')
    }
  }

  const shareToWhatsApp = async () => {
    const blob = await generateStrategyCard(theme)
    const file = new File([blob], "punter-hq-strategy.png", { type: "image/png" })

    await downloadImage()

    const text = `Check out my betting strategy on Punter HQ! 💰\n\nStarting: ${formatCurrency(startingWager)}\nFinal Total: ${formatCurrency(finalTotal)}\nProfit: ${formatCurrency(totalProfit)} (${profitPercentage}%)\n\nhttps://www.punterhq.online/\n\n#punterhq #strategy #betway #betwaycodes #holywoodbets #betting`

    if (navigator.share) {
      try {
        await navigator.share({
          files: [file],
          text: text,
        })
      } catch (err) {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
    }
  }



  const shareToInstagram = async () => {
    await downloadImage()
  }

  const shareToTikTok = async () => {
    await downloadImage()
  }

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8 px-2 sm:px-4 md:px-6">
      <canvas ref={canvasRef} className="hidden" />

      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header */}
        {/* Actions Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black font-mono tracking-tighter italic text-primary">
              STRATEGY <span className="text-foreground">TERMINAL</span>
            </h1>
            <p className="text-muted-foreground font-mono mt-2">/// CALCULATE. EXECUTE. WIN. ///</p>
            {!session?.user && (
              <p className="text-sm text-muted-foreground mt-1">
                Downloads used: {downloadsUsed}/3 (Sign up for unlimited access)
              </p>
            )}
          </div>

          {/* Massive Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={downloadImage}
              className="h-20 text-lg font-bold font-mono skew-x-[-10deg] bg-primary text-primary-foreground hover:bg-white hover:text-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)] border-2 border-primary"
            >
              <div className="flex flex-col items-center skew-x-[10deg]">
                <span className="text-xs uppercase tracking-widest opacity-70">Save Protocol</span>
                <span className="flex items-center gap-2">DOWNLOAD <Share2 className="w-5 h-5" /></span>
              </div>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="h-20 text-lg font-bold font-mono skew-x-[-10deg] bg-accent/20 text-accent border-2 border-accent hover:bg-accent hover:text-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                >
                  <div className="flex flex-col items-center skew-x-[10deg]">
                    <span className="text-xs uppercase tracking-widest opacity-70">Distribute Intel</span>
                    <span className="flex items-center gap-2">SHARE <LayoutGrid className="w-5 h-5" /></span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background border-2 border-accent/50 p-2">
                <DropdownMenuItem onClick={shareToWhatsApp} className="cursor-pointer font-mono font-bold hover:bg-accent hover:text-white focus:bg-accent focus:text-white">
                  SHARE TO SOCIALMEDIA
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Strategy Settings */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl text-primary">Strategy Settings</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Configure your betting strategy parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="starting-wager" className="text-sm sm:text-base">
                  Starting Wager (R)
                </Label>
                <Input
                  id="starting-wager"
                  type="number"
                  value={startingWager}
                  onChange={(e) => setStartingWager(Number(e.target.value))}
                  className="h-12 sm:h-10 text-base sm:text-sm border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-odds" className="text-sm sm:text-base">
                  Default Odds {usePercentage ? "(%)" : "(Decimal)"}
                </Label>
                <Input
                  id="default-odds"
                  type="number"
                  step="0.01"
                  value={usePercentage ? ((defaultOdds - 1) * 100).toFixed(0) : defaultOdds.toFixed(2)}
                  onChange={(e) => setDefaultOdds(parseOddsInput(e.target.value))}
                  className="h-12 sm:h-10 text-base sm:text-sm border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number-of-days" className="text-sm sm:text-base">
                  Number of Days
                </Label>
                <Input
                  id="number-of-days"
                  type="number"
                  min="1"
                  max="365"
                  value={numberOfDays}
                  onChange={(e) => setNumberOfDays(Number(e.target.value))}
                  className="h-12 sm:h-10 text-base sm:text-sm border-2"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-6">
              <Switch
                id="percentage-mode"
                checked={usePercentage}
                onCheckedChange={setUsePercentage}
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="percentage-mode" className="text-sm sm:text-base cursor-pointer">
                Use Percentage Format for Odds
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="border-2 border-border">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="text-base sm:text-lg text-muted-foreground">Starting Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-bold text-primary">{formatCurrency(startingWager)}</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-border">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="text-base sm:text-lg text-muted-foreground">Final Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl sm:text-3xl font-bold ${finalTotal >= startingWager ? "text-green-500" : "text-red-500"}`}
              >
                {formatCurrency(finalTotal)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 border-border">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="text-base sm:text-lg text-muted-foreground">Profit/Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl sm:text-3xl font-bold ${totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatCurrency(totalProfit)} ({profitPercentage}%)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Progression */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              <div>
                <CardTitle className="text-xl sm:text-2xl text-primary">Daily Progression</CardTitle>
                <CardDescription className="text-sm sm:text-base mt-1">
                  Track your betting strategy day by day
                </CardDescription>
              </div>
              <Tabs
                value={viewMode}
                onValueChange={(v) => setViewMode(v as "table" | "calendar")}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid w-full grid-cols-2 h-11 sm:h-10">
                  <TabsTrigger
                    value="table"
                    className="text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <TableIcon className="h-4 w-4 mr-2" />
                    Table
                  </TabsTrigger>
                  <TabsTrigger
                    value="calendar"
                    className="text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Calendar
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "table" ? (
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b-2 border-border hover:bg-transparent">
                        <TableHead className="text-primary font-bold text-base sm:text-sm whitespace-nowrap">
                          DAY
                        </TableHead>
                        <TableHead className="text-primary font-bold text-base sm:text-sm whitespace-nowrap">
                          WAGER
                        </TableHead>
                        <TableHead className="text-primary font-bold text-base sm:text-sm whitespace-nowrap">
                          ODDS
                        </TableHead>
                        <TableHead className="text-primary font-bold text-base sm:text-sm whitespace-nowrap">
                          WINNINGS
                        </TableHead>
                        <TableHead className="text-primary font-bold text-base sm:text-sm text-center whitespace-nowrap">
                          CHECK
                        </TableHead>
                        <TableHead className="text-primary font-bold text-base sm:text-sm whitespace-nowrap">
                          TOTAL
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableData.map((row) => {
                        const runningTotal = calculateRunningTotal(row.day - 1)
                        return (
                          <TableRow key={row.day} className="border-b border-border">
                            <TableCell className="font-medium text-base sm:text-sm py-3 sm:py-4">{row.day}</TableCell>
                            <TableCell className="text-base sm:text-sm py-3 sm:py-4">
                              <Input
                                type="number"
                                value={row.wager.toFixed(2)}
                                onChange={(e) => updateWager(row.day, Number(e.target.value))}
                                className="w-full min-w-[120px] h-11 sm:h-9 text-base sm:text-sm border-2"
                              />
                            </TableCell>
                            <TableCell className="text-base sm:text-sm py-3 sm:py-4">
                              <Input
                                type="number"
                                step="0.01"
                                value={usePercentage ? ((row.odds - 1) * 100).toFixed(0) : row.odds.toFixed(2)}
                                onChange={(e) => updateOdds(row.day, parseOddsInput(e.target.value))}
                                className="w-full min-w-[100px] h-11 sm:h-9 text-base sm:text-sm border-2"
                              />
                            </TableCell>
                            <TableCell
                              className={`font-semibold text-base sm:text-sm py-3 sm:py-4 ${row.isWin ? "text-green-500" : "text-red-500"}`}
                            >
                              {formatCurrency(row.winnings)}
                            </TableCell>
                            <TableCell className="text-center py-3 sm:py-4">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={row.isWin}
                                  onCheckedChange={() => toggleWinLoss(row.day)}
                                  className="h-6 w-6 sm:h-5 sm:w-5 border-2 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                />
                              </div>
                            </TableCell>
                            <TableCell
                              className={`font-bold text-base sm:text-sm py-3 sm:py-4 ${runningTotal >= startingWager ? "text-green-500" : "text-red-500"}`}
                            >
                              {formatCurrency(runningTotal)}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      <TableRow className="border-t-2 border-primary bg-primary/10 hover:bg-primary/20">
                        <TableCell colSpan={5} className="font-bold text-primary text-base sm:text-lg py-3 sm:py-4">
                          FINAL TOTAL
                        </TableCell>
                        <TableCell
                          className={`font-bold text-base sm:text-lg py-3 sm:py-4 ${finalTotal >= startingWager ? "text-green-500" : "text-red-500"}`}
                        >
                          {formatCurrency(finalTotal)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {tableData.map((row) => {
                    const runningTotal = calculateRunningTotal(row.day - 1)
                    return (
                      <Card
                        key={row.day}
                        className={`border-2 ${row.isWin ? "border-green-500 bg-green-500/5" : "border-red-500 bg-red-500/5"}`}
                      >
                        <CardHeader className="pb-2 sm:pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg sm:text-base text-primary">Day {row.day}</CardTitle>
                            <Checkbox
                              checked={row.isWin}
                              onCheckedChange={() => toggleWinLoss(row.day)}
                              className="h-6 w-6 sm:h-5 sm:w-5 border-2 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2 sm:space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">Wager</Label>
                            <Input
                              type="number"
                              value={row.wager.toFixed(2)}
                              onChange={(e) => updateWager(row.day, Number(e.target.value))}
                              className="mt-1 h-11 sm:h-9 text-base sm:text-sm border-2"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Odds</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={usePercentage ? ((row.odds - 1) * 100).toFixed(0) : row.odds.toFixed(2)}
                              onChange={(e) => updateOdds(row.day, parseOddsInput(e.target.value))}
                              className="mt-1 h-11 sm:h-9 text-base sm:text-sm border-2"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Winnings</Label>
                            <p
                              className={`text-base sm:text-lg font-semibold mt-1 ${row.isWin ? "text-green-500" : "text-red-500"}`}
                            >
                              {formatCurrency(row.winnings)}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Running Total</Label>
                            <p
                              className={`text-base sm:text-lg font-bold mt-1 ${runningTotal >= startingWager ? "text-green-500" : "text-red-500"}`}
                            >
                              {formatCurrency(runningTotal)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
                <Card className="border-2 border-primary bg-primary/10">
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xl sm:text-lg text-primary">Final Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                      <span className="text-base sm:text-lg font-semibold text-primary">Total Balance:</span>
                      <span
                        className={`text-xl sm:text-2xl font-bold ${finalTotal >= startingWager ? "text-green-500" : "text-red-500"}`}
                      >
                        {formatCurrency(finalTotal)}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mt-2">
                      <span className="text-base sm:text-lg font-semibold text-primary">Profit/Loss:</span>
                      <span
                        className={`text-xl sm:text-2xl font-bold ${totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {formatCurrency(totalProfit)} ({profitPercentage}%)
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}