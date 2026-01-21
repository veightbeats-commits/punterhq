import { createClient } from '@supabase/supabase-js'
import { createServerClient, CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid' // For generating unique filenames

export async function POST(request: Request) {
  const bypassKey = request.headers.get('x-bypass-key')
  const POST_BYPASS_KEY = process.env.POST_BYPASS_KEY

  if (!bypassKey || bypassKey !== POST_BYPASS_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cookieStore = cookies()

  // Use service role client when bypassing to avoid RLS issues
  const supabase = bypassKey && bypassKey === POST_BYPASS_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
    : createServerClient(
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

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${fileName}` // File path within the bucket

    const { data, error } = await supabase.storage
      .from('post-images') // Your Supabase Storage bucket name
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type // Set content type for proper rendering
      })

    if (error) {
      console.error('Supabase storage upload error:', error)
      return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 })
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(filePath)

    if (!publicUrlData || !publicUrlData.publicUrl) {
      return NextResponse.json({ error: 'Failed to get public URL' }, { status: 500 })
    }

    return NextResponse.json({ url: publicUrlData.publicUrl })

  } catch (error: any) {
    console.error('API /api/upload-image error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
