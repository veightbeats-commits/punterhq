import { revalidatePath } from 'next/cache'
import { createServerClient, CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()

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

  const { data: posts, error: fetchError } = await supabase.from('posts').select('*')

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const { title, description, category, date, image, source } = await request.json()
  const cookieStore = await cookies()

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

  const bypassKey = request.headers.get('x-bypass-key')
  const POST_BYPASS_KEY = process.env.POST_BYPASS_KEY
  const BYPASS_USER_ID = process.env.BYPASS_USER_ID

  console.log('POST /api/posts - Received request')
  console.log('Bypass Key in request:', bypassKey ? 'Present' : 'Not Present')
  console.log('Expected POST_BYPASS_KEY:', POST_BYPASS_KEY)
  console.log('Expected BYPASS_USER_ID:', BYPASS_USER_ID)

  let user = null
  if (bypassKey && POST_BYPASS_KEY && bypassKey === POST_BYPASS_KEY) {
    if (!BYPASS_USER_ID) {
      console.error('BYPASS_USER_ID is not configured for bypass!')
      return NextResponse.json({ error: 'BYPASS_USER_ID not configured for bypass' }, { status: 500 })
    }
    user = { id: BYPASS_USER_ID } // Mock user for bypass
    console.log('Bypass successful. Using BYPASS_USER_ID:', user.id)
  } else {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    user = authUser
    console.log('Bypass not used. Authenticated user:', user?.id)
  }

  if (!user) {
    console.error('Unauthorized access. No user identified.')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const postData = {
    title,
    description,
    category,
    date,
    image,
    source,
    user_id: user.id,
  }
  console.log('Attempting to insert postData:', postData)

  const { data, error: insertError } = await supabase.from('posts').insert(postData).select()

  if (insertError) {
    console.error('Supabase insert error:', insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  console.log('Post inserted successfully:', data)
  revalidatePath('/')
  return NextResponse.json(data[0])
}

export async function PUT(request: Request) {
  const { id, title, description, category, date, image, source } = await request.json()
  const cookieStore = await cookies()

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

  const bypassKey = request.headers.get('x-bypass-key')
  const POST_BYPASS_KEY = process.env.POST_BYPASS_KEY
  const BYPASS_USER_ID = process.env.BYPASS_USER_ID

  let user = null
  if (bypassKey && POST_BYPASS_KEY && bypassKey === POST_BYPASS_KEY) {
    if (!BYPASS_USER_ID) {
      return NextResponse.json({ error: 'BYPASS_USER_ID not configured for bypass' }, { status: 500 })
    }
    user = { id: BYPASS_USER_ID } // Mock user for bypass
  } else {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    user = authUser
  }

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error: updateError } = await supabase.from('posts').update({
    title,
    description,
    category,
    date,
    image,
    source,
  }).eq('id', id).eq('user_id', user.id).select()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  revalidatePath('/')
  return NextResponse.json(data[0])
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const cookieStore = await cookies()

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

  const bypassKey = request.headers.get('x-bypass-key')
  const POST_BYPASS_KEY = process.env.POST_BYPASS_KEY
  const BYPASS_USER_ID = process.env.BYPASS_USER_ID

  let user = null
  if (bypassKey && POST_BYPASS_KEY && bypassKey === POST_BYPASS_KEY) {
    if (!BYPASS_USER_ID) {
      return NextResponse.json({ error: 'BYPASS_USER_ID not configured for bypass' }, { status: 500 })
    }
    user = { id: BYPASS_USER_ID } // Mock user for bypass
  } else {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    user = authUser
  }

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error: deleteError } = await supabase.from('posts').delete().eq('id', id).eq('user_id', user.id)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  revalidatePath('/')
  return NextResponse.json({ message: 'Post deleted successfully' })
}
