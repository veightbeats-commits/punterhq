import { createStaticClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const order = searchParams.get('order') || 'desc'

    const supabase = createStaticClient()

    // Fetch strategies with pagination
    const client = await supabase
    const { data: strategies, error, count } = await client
      .from('user_strategies')
      .select(`
        *,
        profiles(username),
        user_favorites(count)
      `, { count: 'exact' })
      .eq('public', true)
      .order(sortBy as any, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching strategies:', error)
      return NextResponse.json(
        { error: 'Failed to fetch strategies' },
        { status: 500 }
      )
    }

    // Enhance strategies with additional data
    const enhancedStrategies = (strategies || []).map((strategy: any) => {
      const strategyData = strategy.strategy_data as any
      const finalTotal = strategyData?.finalTotal || (strategyData?.startingWager * Math.pow(1.5, strategyData?.numberOfDays || 7))
      const totalProfit = finalTotal - (strategyData?.startingWager || 100)
      const profitPercentage = ((totalProfit / (strategyData?.startingWager || 100)) * 100)

      // Generate random but consistent data for demo purposes
      const difficulty = ['beginner', 'intermediate', 'advanced'][strategy.id.charCodeAt(0) % 3]
      const successRate = 30 + (strategy.id.charCodeAt(1) % 70)
      const views = 10 + (strategy.id.charCodeAt(2) % 500)
      const tags = [
        ['Conservative', 'Low Risk', 'Steady Growth'],
        ['Aggressive', 'High Risk', 'Quick Profits'],
        ['Balanced', 'Medium Risk', 'Sustainable'],
        ['Beginner Friendly', 'Simple Strategy'],
        ['Advanced', 'Complex', 'High Returns']
      ][strategy.id.charCodeAt(3) % 5]

      return {
        id: strategy.id,
        name: strategy.name,
        description: strategy.description,
        username: strategy.profiles?.username || 'Anonymous',
        strategyData: {
          startingWager: strategyData?.startingWager || 100,
          numberOfDays: strategyData?.numberOfDays || 7,
          finalTotal,
          totalProfit,
          profitPercentage
        },
        public: strategy.public,
        createdAt: strategy.created_at,
        views,
        favorites: strategy.user_favorites?.[0]?.count || 0,
        tags,
        difficulty,
        successRate
      }
    })

    const total = count || 0
    const hasMore = offset + limit < total

    return NextResponse.json({
      data: enhancedStrategies,
      hasMore,
      total,
      page: Math.floor(offset / limit) + 1
    })

  } catch (error) {
    console.error('Error fetching strategies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch strategies' },
      { status: 500 }
    )
  }
}