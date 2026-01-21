"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useSession } from "@/components/session-provider"
import { Pencil, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

interface Post {
  id: number
  title: string
  description: string
  category: string
  date: string
  image: string
  source: string
}

const PostForm = ({ post, onSave }: { post?: Post, onSave: () => void }) => {
  const [title, setTitle] = useState(post?.title || '')
  const [description, setDescription] = useState(post?.description || '')
  const [category, setCategory] = useState(post?.category || '')
  const [date, setDate] = useState(post?.date || '')
  const [image, setImage] = useState(post?.image || '')
  const [source, setSource] = useState(post?.source || '')

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setDescription(post.description)
      setCategory(post.category)
      setDate(post.date)
      setImage(post.image)
      setSource(post.source)
    } else {
      setTitle('')
      setDescription('')
      setCategory('')
      setDate('')
      setImage('')
      setSource('')
    }
  }, [post])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const postData = {
      title,
      description,
      category,
      date,
      image,
      source,
    }

    if (post) {
      // Update existing post
      await fetch('/api/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: post.id, ...postData }),
      })
    } else {
      // Create new post
      await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })
    }

    onSave()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="source">Source</Label>
        <Input id="source" value={source} onChange={(e) => setSource(e.target.value)} />
      </div>
      <Button type="submit">Save</Button>
    </form>
  )
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | undefined>(undefined)
  const { session, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!session || session.user.profile?.role !== 'admin')) {
      router.push('/') // Redirect to home page if not an admin
    }
  }, [session, loading, router])

  if (loading || !session || session.user.profile?.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading or Unauthorized...</p>
      </div>
    )
  }

  const getPosts = async () => {
    const response = await fetch('/api/posts')
    const data = await response.json()
    setPosts(data)
  }

  useEffect(() => {
    getPosts()
  }, [])

  const handleDelete = async (id: number) => {
    await fetch('/api/posts', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
    getPosts()
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 space-y-12 mb-24">
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <h2 className="text-2xl md:text-3xl font-bold font-mono uppercase flex items-center gap-2">
              <span className="w-3 h-8 bg-primary skew-x-[-20deg]"></span>
              Manage Posts
            </h2>
            <div className="flex items-center gap-4">
              {session && session.user.profile?.role === 'admin' && (
                <Dialog open={showForm} onOpenChange={setShowForm}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedPost(undefined)}>Create Post</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <PostForm post={selectedPost} onSave={() => {
                      setShowForm(false)
                      setSelectedPost(undefined)
                      getPosts()
                    }} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((article) => {
              return (
                <Card
                  key={article.id}
                  className="group border border-border bg-card/60 backdrop-blur-sm hover:border-primary/80 transition-all duration-300 shine-effect overflow-visible"
                >
                  <div className="relative h-48 overflow-hidden border-b border-border/50">
                    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover:opacity-0 transition-opacity z-10" />
                    <img
                      src={article.image || "https://placehold.co/600x400"}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        if (target.src !== "https://placehold.co/600x400/1a1a1a/ffffff?text=Image+Not+Found") {
                          target.src = "https://placehold.co/600x400/1a1a1a/ffffff?text=Image+Not+Found"
                        }
                      }}
                    />
                    <div className="absolute top-0 right-0 bg-primary text-black font-bold font-mono text-xs px-3 py-1 skewed-edge z-20">
                      {article.category}
                    </div>
                  </div>

                  <CardHeader className="pb-2 space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                      <span className="flex items-center gap-1"><Pencil className="w-3 h-3 text-primary" /> {article.date}</span>
                      <span className="text-accent">{article.source}</span>
                    </div>
                    <CardTitle className="text-lg font-bold font-mono tracking-tight leading-tight group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 border-l-2 border-primary/20 pl-3">
                      {article.description}
                    </p>
                  </CardContent>

                  <CardFooter className="pt-0 flex justify-between items-center">
                    {session && session.user.profile?.role === 'admin' && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => {
                          setSelectedPost(article)
                          setShowForm(true)
                        }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(article.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}


