import { createServerClient, CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const resolvedParams = await params

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          (await cookieStore).set({ name, value, ...options })
        },
        async remove(name: string, options: CookieOptions) {
          (await cookieStore).set({ name, value: '', ...options })
        },
      },
    }
  )

  const postId = resolvedParams.id

  if (!postId || isNaN(Number(postId))) {
    return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
  }

  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single()

  if (fetchError) {
    console.error('Error fetching post:', fetchError)
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json(post)
}