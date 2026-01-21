'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/components/session-provider'
import { createClientComponentClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StatusRow } from '@/components/status-row'

interface Favorite {
  id: string
  name: string
  image_url: string
  betway_link: string
  social_link?: string
}

export default function ProfilePage() {
  const { session, loading } = useSession()
  const router = useRouter()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (!loading && !session) {
      router.push('/login')
    }
  }, [session, loading, router])

  useEffect(() => {
    if (session) {
      fetchFavorites()
    }
  }, [session])

  const fetchFavorites = async () => {
    if (!session) return
    const { data, error } = await supabase
      .from('user_favorites')
      .select('status_cards(*)')
      .eq('user_id', session.user.id)

    if (error) {
      console.error('Error fetching favorites:', error)
    } else {
      setFavorites(data?.map((item: any) => item.status_cards as Favorite) || [])
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!session) {
    return null
  }

  const user = session.user
  const profile = user.profile

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>{profile?.username?.[0] || user.email?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{profile?.username || 'User'}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{favorites.length}</div>
              <div className="text-sm text-muted-foreground">Favorite Strategies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Total Bets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">0%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Favorite Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          {favorites.length > 0 ? (
            <StatusRow cards={favorites} />
          ) : (
            <p className="text-muted-foreground">No favorite strategies yet. Heart some status cards to add them here!</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}