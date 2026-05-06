import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'Next.js API is alive',
    time: new Date().toISOString(),
    env: {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }
  })
}
