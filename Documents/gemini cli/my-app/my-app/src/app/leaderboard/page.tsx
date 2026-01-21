'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'

interface LeaderboardUser {
  user_id: string
  username: string
  comments_count: number
  favorites_count: number
  total_points: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    // Fetch comments count per user
    const { data: commentsData } = await supabase
      .from('status_card_comments')
      .select('user_id, profiles(username)')

    // Fetch favorites count per user
    const { data: favoritesData } = await supabase
      .from('user_favorites')
      .select('user_id, profiles(username)')

    // Count per user
    const userStats: { [key: string]: { username: string, comments: number, favorites: number } } = {}

    commentsData?.forEach((c: any) => {
      const uid = c.user_id
      if (!userStats[uid]) userStats[uid] = { username: c.profiles?.username || 'Anonymous', comments: 0, favorites: 0 }
      userStats[uid].comments++
    })

    favoritesData?.forEach((f: any) => {
      const uid = f.user_id
      if (!userStats[uid]) userStats[uid] = { username: f.profiles?.username || 'Anonymous', comments: 0, favorites: 0 }
      userStats[uid].favorites++
    })

    const leaderboardData = Object.entries(userStats).map(([user_id, stats]) => ({
      user_id,
      username: stats.username,
      comments_count: stats.comments,
      favorites_count: stats.favorites,
      total_points: stats.comments + stats.favorites
    })).sort((a, b) => b.total_points - a.total_points)

    setLeaderboard(leaderboardData)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Leaderboard</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-2">Rank</th>
              <th className="border border-border p-2">Username</th>
              <th className="border border-border p-2">Comments</th>
              <th className="border border-border p-2">Favorites</th>
              <th className="border border-border p-2">Total Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={user.user_id} className="hover:bg-muted/50">
                <td className="border border-border p-2 text-center">{index + 1}</td>
                <td className="border border-border p-2">{user.username}</td>
                <td className="border border-border p-2 text-center">{user.comments_count}</td>
                <td className="border border-border p-2 text-center">{user.favorites_count}</td>
                <td className="border border-border p-2 text-center font-bold">{user.total_points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}