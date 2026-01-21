import { useState, useEffect } from "react"
import { Heart, Eye, TrendingUp, Users, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSession } from "@/components/session-provider"
import { createClientComponentClient } from "@/lib/supabase"
import { toast } from "sonner"

interface EnhancedStrategyCardProps {
  id: string
  name: string
  description: string
  username: string
  strategyData: {
    startingWager: number
    numberOfDays: number
    finalTotal?: number
    totalProfit?: number
    profitPercentage?: number
  }
  public: boolean
  createdAt: string
  views?: number
  favorites?: number
  tags?: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  successRate?: number
}

export function EnhancedStrategyCard({
  id,
  name,
  description,
  username,
  strategyData,
  public: publicStrategy,
  createdAt,
  views = 0,
  favorites = 0,
  tags = [],
  difficulty = 'beginner',
  successRate
}: EnhancedStrategyCardProps) {
  const { session } = useSession()
  const [isFavorited, setIsFavorited] = useState(false)
  const [currentFavorites, setCurrentFavorites] = useState(favorites)
  const [currentViews, setCurrentViews] = useState(views)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (session) {
      checkFavorite()
    }
    // Increment view count when card is rendered
    incrementViews()
  }, [session, id])

  const incrementViews = async () => {
    await supabase
      .from('user_strategies')
      .update({ views: currentViews + 1 })
      .eq('id', id)
      .single()
    setCurrentViews(prev => prev + 1)
  }

  const checkFavorite = async () => {
    if (!session) return
    const { data } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('strategy_id', id)
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
        .eq('strategy_id', id)
      setCurrentFavorites(prev => prev - 1)
      toast.success("Removed from favorites")
    } else {
      await supabase
        .from('user_favorites')
        .insert({ user_id: session.user.id, strategy_id: id })
      setCurrentFavorites(prev => prev + 1)
      toast.success("Added to favorites")
    }
    setIsFavorited(!isFavorited)
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500 text-white'
      case 'intermediate': return 'bg-yellow-500 text-white'
      case 'advanced': return 'bg-red-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 70) return 'text-green-500'
    if (rate >= 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const calculateMetrics = () => {
    const finalTotal = strategyData.finalTotal || (strategyData.startingWager * Math.pow(1.5, strategyData.numberOfDays))
    const totalProfit = finalTotal - strategyData.startingWager
    const profitPercentage = ((totalProfit / strategyData.startingWager) * 100)

    return { finalTotal, totalProfit, profitPercentage }
  }

  const { finalTotal, totalProfit, profitPercentage } = calculateMetrics()

  return (
    <Card className="group border border-border bg-card/60 backdrop-blur-sm hover:border-primary/80 transition-all duration-300 overflow-hidden">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-mono line-clamp-2 group-hover:text-primary transition-colors">
              {name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">by {username}</p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge className={getDifficultyColor(difficulty)}>
              {difficulty.toUpperCase()}
            </Badge>
            {successRate && (
              <div className={`text-xs font-mono font-bold ${getSuccessRateColor(successRate)}`}>
                {successRate}% SUCCESS
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description || 'No description provided'}
        </p>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Starting</div>
            <div className="font-bold font-mono text-sm">
              {formatCurrency(strategyData.startingWager)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Final</div>
            <div className="font-bold font-mono text-sm text-green-500">
              {formatCurrency(finalTotal)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Profit</div>
            <div className={`font-bold font-mono text-sm ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(totalProfit)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Return</div>
            <div className={`font-bold font-mono text-sm ${profitPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {profitPercentage.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {currentViews}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {currentFavorites}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {strategyData.numberOfDays} days
            </div>
          </div>
          <div className="font-mono">
            {new Date(createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/strategies/${id}`} className="flex-1">
            <Button className="w-full" size="sm">
              View Strategy
            </Button>
          </Link>
          {session && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFavorite}
              className={`px-3 ${isFavorited ? 'border-red-500 text-red-500' : ''}`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}