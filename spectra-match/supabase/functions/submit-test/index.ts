import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.11.0'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const TOTAL_QUESTIONS = 60
const QUESTIONS_PER_DIM = 15
const TYPE_THRESHOLD = 50

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Unauthorized')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const geminiKey = Deno.env.get('GEMINI_API_KEY')!

    const supabase = createClient(supabaseUrl, serviceKey)
    const userToken = authHeader.replace('Bearer ', '')

    const { data: { user }, error: authError } = await supabase.auth.getUser(userToken)
    if (authError || !user) throw new Error('Invalid token')

    const { sessionId, answers } = await req.json()

    // 1. Scoring
    const byDimension: Record<string, number[]> = { EI: [], SN: [], TF: [], JP: [] }
    for (const a of answers) {
      const dim = a.questionId.split('-')[0]
      if (dim in byDimension) byDimension[dim].push(a.score)
    }

    const scores: any = {}
    for (const [dim, vals] of Object.entries(byDimension)) {
      const sum = vals.reduce((a, b) => a + b, 0)
      const min = 15, max = 105 // 15 questions * (1 to 7)
      const normalized = ((sum - min) / (max - min)) * 100
      scores[dim] = Math.round(normalized)
    }

    const mbtiType = [
      scores.EI >= 50 ? 'E' : 'I',
      scores.SN >= 50 ? 'N' : 'S',
      scores.TF >= 50 ? 'F' : 'T',
      scores.JP >= 50 ? 'P' : 'J'
    ].join('')

    // 2. AI Generation
    const genAI = new GoogleGenerativeAI(geminiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const { data: prompts } = await supabase.from('excerpt_prompts').select('*').eq('is_active', true)
    const { data: compatData } = await supabase.from('compatibility_map').select('*').eq('mbti_type', mbtiType).single()

    const personalityPrompt = prompts?.find(p => p.prompt_type === 'personality' && p.mbti_type === mbtiType)
    const compatibilityPrompt = prompts?.find(p => p.prompt_type === 'compatibility')

    let personalityExcerpt = '', compatibilityExcerpt = ''

    try {
      if (personalityPrompt) {
        const result = await model.generateContent({
          systemInstruction: personalityPrompt.system_prompt,
          contents: [{ role: 'user', parts: [{ text: `Type: ${mbtiType}, Scores: ${JSON.stringify(scores)}. Write a deep 4-sentence analysis.` }] }]
        })
        personalityExcerpt = result.response.text()
      }

      if (compatibilityPrompt && compatData) {
        const result = await model.generateContent({
          systemInstruction: compatibilityPrompt.system_prompt,
          contents: [{ role: 'user', parts: [{ text: `Type: ${mbtiType}, Matches: ${compatData.compatible_types.join(', ')}. Rationale: ${compatData.compatibility_rationale}. Explain the chemistry.` }] }]
        })
        compatibilityExcerpt = result.response.text()
      }
    } catch (e) {
      console.error('AI Error:', e)
    }

    // 3. Save & Return
    await supabase.from('personality_profiles').update({ is_current: false }).eq('user_id', user.id)
    const { data: profile } = await supabase.from('personality_profiles').insert({
      user_id: user.id,
      mbti_type: mbtiType,
      ei_score: scores.EI, sn_score: scores.SN, tf_score: scores.TF, jp_score: scores.JP,
      personality_excerpt: personalityExcerpt,
      compatibility_excerpt: compatibilityExcerpt,
      is_current: true
    }).select().single()

    return new Response(JSON.stringify({ mbtiType, scores, profileId: profile?.id }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    })
  }
})
