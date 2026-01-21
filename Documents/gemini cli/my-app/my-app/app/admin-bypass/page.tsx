"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Pencil, Trash2, Key, Lock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Post {
  id: number
  title: string
  description: string
  category: string
  date: string
  image: string | null
  source: string
}

interface FormState {
  error: string | null
  success: string | null
}

const PostForm = ({ post, onSave, bypassKey }: { post?: Post, onSave: () => void, bypassKey: string }) => {
  const [title, setTitle] = useState(post?.title || '')
  const [description, setDescription] = useState(post?.description || '')
  const [category, setCategory] = useState(post?.category || 'News')
  const [date, setDate] = useState(post?.date || new Date().toISOString().split('T')[0])
  const [image, setImage] = useState(post?.image || '')
  const [source, setSource] = useState(post?.source || '')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(post?.image || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [formState, setFormState] = useState<FormState>({ error: null, success: null })

  const handleImageUpload = async (file: File) => {
    if (!file) return null

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'x-bypass-key': bypassKey,
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setImagePreview(result.url)
        return result.url
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to upload image')
        return null
      }
    } catch (error) {
      toast.error('Network error during image upload')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormState({ error: null, success: null })

    try {
      let imageUrl = imagePreview || null

      // Upload image if a new file is selected
      if (selectedFile) {
        imageUrl = await handleImageUpload(selectedFile)
        if (imageUrl === null) {
          setFormState({ error: 'Failed to upload image', success: null })
          setIsSubmitting(false)
          return
        }
      } else if (imagePreview && imagePreview.startsWith('data:')) {
        // This is a local preview, not a real URL
        setFormState({ error: 'Please upload the image or enter a URL', success: null })
        setIsSubmitting(false)
        return
      } else if (imagePreview && !imagePreview.startsWith('http')) {
        // Invalid URL
        setFormState({ error: 'Please enter a valid image URL or upload an image', success: null })
        setIsSubmitting(false)
        return
      }

      const postData: any = {
        title,
        description,
        category,
        date,
        image: imageUrl,
        source
      }

      let url = '/api/posts'
      let method = 'POST'
      
      if (post) {
        url = `/api/posts`
        method = 'PUT'
        postData.id = post.id
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-bypass-key': bypassKey,
        },
        body: JSON.stringify(postData)
      })

      if (response.ok) {
        const result = await response.json()
        setFormState({ success: post ? 'Post updated successfully!' : 'Post created successfully!', error: null })
        toast.success(post ? 'Post updated successfully!' : 'Post created successfully!')
        onSave?.()
        
        // Reset form if creating new post
        if (!post) {
          setTitle('')
          setDescription('')
          setCategory('News')
          setDate(new Date().toISOString().split('T')[0])
          setSelectedFile(null)
          setImagePreview(null)
          setSource('')
        }
      } else {
        const errorData = await response.json()
        setFormState({ error: errorData.error || 'Failed to save post', success: null })
        toast.error(errorData.error || 'Failed to save post')
      }
    } catch (error) {
      const errorMessage = 'Network error occurred'
      setFormState({ error: errorMessage, success: null })
      toast.error(errorMessage)
      console.error('Error saving post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post ? 'Edit Post' : 'Create New Post'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="w-full"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter post description"
              rows={4}
              className="w-full"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category"
              className="w-full"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="image">Image</Label>
            <div className="space-y-4">
              {/* Image URL Option */}
              <div className="space-y-2">
                <Label htmlFor="image-url" className="text-sm font-medium">
                  Or Enter Image URL
                </Label>
                <Input
                  id="image-url"
                  value={imagePreview && !imagePreview.startsWith('data:') ? imagePreview : ''}
                  onChange={(e) => {
                    setImagePreview(e.target.value)
                    setSelectedFile(null)
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full"
                />
              </div>

              {/* Image Upload Option */}
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="text-sm font-medium">
                    Or Upload Image File
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="cursor-pointer"
                  />
                  {isUploading && (
                    <p className="text-sm text-muted-foreground">Uploading image...</p>
                  )}
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Preview</Label>
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Image preview"
                      className="w-full h-48 object-cover rounded-lg border border-border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null)
                        setImagePreview(null)
                        setImage('')
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Enter source"
              className="w-full"
            />
          </div>

          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

const BypassLoginForm = ({ onAuthenticate, isLoading }: { onAuthenticate: (key: string) => void, isLoading: boolean }) => {
  const [bypassKey, setBypassKey] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (bypassKey.trim()) {
      onAuthenticate(bypassKey.trim())
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Key className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Bypass</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your bypass key to access admin functionality
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bypassKey">Bypass Key</Label>
              <Input
                id="bypassKey"
                type="password"
                value={bypassKey}
                onChange={(e) => setBypassKey(e.target.value)}
                placeholder="Enter bypass key"
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !bypassKey.trim()}
            >
              {isLoading ? (
                <>
                  <Lock className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Access Admin Panel
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminBypassPage() {
  const [bypassKey, setBypassKey] = useState<string>('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAuthenticate = async (key: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Test the bypass key by making a GET request to /api/posts
      const response = await fetch('/api/posts', {
        headers: {
          'x-bypass-key': key,
        },
      })

      if (response.ok) {
        setBypassKey(key)
        setIsAuthenticated(true)
        toast.success('Successfully authenticated with bypass key')
        // Clear the key from memory for security
        setBypassKey(key)
      } else {
        setError('Invalid bypass key')
        toast.error('Invalid bypass key')
      }
    } catch (error) {
      setError('Network error during authentication')
      toast.error('Network error during authentication')
    } finally {
      setIsLoading(false)
    }
  }

  const getPosts = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/posts', {
        headers: {
          'x-bypass-key': bypassKey,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      } else {
        setError('Failed to fetch posts')
        toast.error('Failed to fetch posts')
      }
    } catch (error) {
      setError('Network error while fetching posts')
      toast.error('Network error while fetching posts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/posts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-bypass-key': bypassKey,
        },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        toast.success('Post deleted successfully')
        getPosts() // Refresh the posts list
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to delete post')
      }
    } catch (error) {
      toast.error('Network error while deleting post')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      getPosts()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <BypassLoginForm onAuthenticate={handleAuthenticate} isLoading={isLoading} />
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 space-y-12 mb-24">
        {/* Header */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <h2 className="text-2xl md:text-3xl font-bold font-mono uppercase flex items-center gap-2">
              <span className="w-3 h-8 bg-primary skew-x-[-20deg]"></span>
              Admin Bypass Panel
            </h2>
            <div className="flex items-center gap-4">
              <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedPost(undefined)}>Create Post</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{selectedPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedPost ? 'Edit the existing post details below.' : 'Fill in the details to create a new post.'}
                    </p>
                  </DialogHeader>
                  <PostForm 
                    post={selectedPost} 
                    onSave={() => {
                      setShowForm(false)
                      setSelectedPost(undefined)
                      getPosts()
                    }} 
                    bypassKey={bypassKey}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="space-y-6">
          {isLoading && posts.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No posts found</p>
                <Button onClick={() => setShowForm(true)}>Create your first post</Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="group border border-border bg-card/60 backdrop-blur-sm hover:border-primary/80 transition-all duration-300 overflow-visible"
                >
                  <div className="relative h-48 overflow-hidden border-b border-border/50">
                    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover:opacity-0 transition-opacity z-10" />
                    <img
                      src={post.image || "https://placehold.co/600x400"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        if (target.src !== "https://placehold.co/600x400/1a1a1a/ffffff?text=Image+Not+Found") {
                          target.src = "https://placehold.co/600x400/1a1a1a/ffffff?text=Image+Not+Found"
                        }
                      }}
                    />
                    <div className="absolute top-0 right-0 bg-primary text-black font-bold font-mono text-xs px-3 py-1 skewed-edge z-20">
                      {post.category}
                    </div>
                  </div>

                  <CardHeader className="pb-2 space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                      <span>{post.date}</span>
                      <span className="text-accent">{post.source}</span>
                    </div>
                    <CardTitle className="text-lg font-bold font-mono tracking-tight leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 border-l-2 border-primary/20 pl-3">
                      {post.description}
                    </p>
                  </CardContent>

                  <CardFooter className="pt-0 flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => {
                          setSelectedPost(post)
                          setShowForm(true)
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => handleDelete(post.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}