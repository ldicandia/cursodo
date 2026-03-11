import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Redirect to the provided next URL, or to the dashboard
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
    console.error('Exchange code error:', error)
  }

  // Handle errors
  return NextResponse.redirect(new URL('/login?error=Could not verify email', requestUrl.origin))
}
