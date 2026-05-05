import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const url = new URL(req.url)
    const minScore = parseInt(url.searchParams.get('minScore') ?? '50')
    const page = Math.max(0, parseInt(url.searchParams.get('page') ?? '0'))
    const pageSize = 20

    // Query match_scores joined with profiles and personality_profiles
    const { data: matches, error: matchError } = await supabase
      .from('match_scores')
      .select(`
        id,
        user_b,
        final_score,
        profiles!match_scores_user_b_fkey (
          display_name,
          avatar_url
        )
      `)
      .eq('user_a', user.id)
      .gte('final_score', minScore)
      .order('final_score', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (matchError) throw matchError

    // Fetch mbti_type for each matched user
    const userBIds = (matches ?? []).map((m: { user_b: string }) => m.user_b)
    const { data: profiles } = await supabase
      .from('personality_profiles')
      .select('user_id, mbti_type')
      .in('user_id', userBIds)
      .eq('is_current', true)

    const mbtiMap = new Map(
      (profiles ?? []).map((p: { user_id: string; mbti_type: string }) => [p.user_id, p.mbti_type])
    )

    const enriched = (matches ?? []).map((m: {
      id: string;
      user_b: string;
      final_score: number;
      profiles: { display_name: string | null; avatar_url: string | null } | null
    }) => ({
      matchId: m.id,
      userId: m.user_b,
      displayName: m.profiles?.display_name ?? 'Anonymous',
      avatarUrl: m.profiles?.avatar_url ?? null,
      mbtiType: mbtiMap.get(m.user_b) ?? null,
      compatibilityScore: m.final_score,
    }))

    return new Response(
      JSON.stringify({ matches: enriched, page, pageSize }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('matches error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
})
